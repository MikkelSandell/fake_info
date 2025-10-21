jest.mock('fs', () => ({
  readFileSync: jest.fn(() =>
    JSON.stringify({
      persons: [
        { firstName: 'Anna', lastName: 'Jensen', gender: 'female' },
        { firstName: 'Peter', lastName: 'Hansen', gender: 'male' }
      ]
    })
  ),
}));

jest.mock('../../src/Town.js', () => {
  return class Town {
    async getRandomTown() { return { postal_code: '1301', town_name: 'København K' }; }
    async disconnect() {}
  };
});

const FakeInfo = require('../../src/fakeinfo.js');

function withMockRandom(sequence, fn) {
  const spy = jest.spyOn(Math, 'random').mockImplementation(() => {
    const v = sequence.shift();
    return v !== undefined ? v : 0;
  });
  try { return fn(); } finally { spy.mockRestore(); }
}

describe('FakeInfo white-box: setCpr', () => {
  test('female overflow branch: odd finalDigit -> increment -> 0', () => {
    const fi = new FakeInfo();
    fi.birthDate = '2004-02-29';
    fi.gender = FakeInfo.GENDER_FEMININE;

    withMockRandom([0.95, 0.1, 0.2, 0.3], () => fi.setCpr());

    expect(fi.cpr).toMatch(/^\d{10}$/);
    expect(fi.cpr.startsWith('290204')).toBe(true);
    expect(Number(fi.cpr[9])).toBe(0);
  });

  test('female: even finalDigit => no parity fix', () => {
    const fi = new FakeInfo();
    fi.birthDate = '2000-01-01';
    fi.gender = FakeInfo.GENDER_FEMININE;
    withMockRandom([0.8, 0.1, 0.1, 0.1], () => fi.setCpr());
    expect(Number(fi.cpr[9]) % 2).toBe(0);
  });
});

describe('FakeInfo white-box: setCpr (male branch)', () => {
  test('male: even finalDigit increments to odd (no overflow)', () => {
    const fi = new FakeInfo();
    fi.birthDate = '1999-12-31';
    fi.gender = FakeInfo.GENDER_MASCULINE;

    withMockRandom([0.8, 0.1, 0.1, 0.1], () => fi.setCpr());

    expect(fi.cpr).toMatch(/^\d{10}$/);
    expect(fi.cpr.startsWith('311299')).toBe(true);
    expect(Number(fi.cpr[9]) % 2).toBe(1);
  });

  test('male: odd finalDigit => no parity fix', () => {
    const fi = new FakeInfo();
    fi.birthDate = '2000-01-01';
    fi.gender = FakeInfo.GENDER_MASCULINE;
    withMockRandom([0.9, 0.1, 0.1, 0.1], () => fi.setCpr());
    expect(Number(fi.cpr[9]) % 2).toBe(1);
  });
});

describe('FakeInfo white-box: setPhone', () => {
  test('picks first prefix "2" and pads to length 8', () => {
    const fi = new FakeInfo();
    withMockRandom([0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7], () => fi.setPhone());
    expect(fi.phone).toMatch(/^\d{8}$/);
    expect(fi.phone.startsWith('2')).toBe(true);
  });

  test('2-digit prefix "30"', () => {
    const fi = new FakeInfo();
    const idx = FakeInfo.PHONE_PREFIXES.indexOf('30');
    const frac = idx / FakeInfo.PHONE_PREFIXES.length + 1e-9;
    withMockRandom([frac, 0.1,0.2,0.3,0.4,0.5], () => fi.setPhone());
    expect(fi.phone.startsWith('30')).toBe(true);
    expect(fi.phone).toMatch(/^\d{8}$/);
  });

  test('3-digit prefix "398"', () => {
    const fi = new FakeInfo();
    const idx = FakeInfo.PHONE_PREFIXES.indexOf('398');
    const frac = idx / FakeInfo.PHONE_PREFIXES.length + 1e-9;
    withMockRandom([frac, 0.1,0.2,0.3,0.4], () => fi.setPhone());
    expect(fi.phone.startsWith('398')).toBe(true);
    expect(fi.phone).toMatch(/^\d{8}$/);
  });
});

describe('FakeInfo white-box: setAddress (DB success)', () => {
  test('uses Town.getRandomTown result for postal/town', async () => {
    const fi = new FakeInfo();
    await fi.setAddress();
    expect(fi.address).toHaveProperty('street');
    expect(fi.address).toHaveProperty('number');
    expect(fi.address.postal_code).toBe('1301');
    expect(fi.address.town_name).toBe('København K');
  });
});

describe('FakeInfo white-box: setAddress (DB fallback)', () => {
  test('falls back to mock towns when Town.getRandomTown rejects', async () => {
    const Town = require('../../src/Town.js');
    const townSpy = jest
      .spyOn(Town.prototype, 'getRandomTown')
      .mockRejectedValueOnce(new Error('DB down'));
    const mockFallbackSpy = jest.spyOn(FakeInfo.prototype, 'setMockAddressData');

    const fi = new FakeInfo();
    await fi.setAddress();

    expect(mockFallbackSpy).toHaveBeenCalled();
    expect(fi.address.postal_code).toMatch(/^\d{4}$/);
    expect(typeof fi.address.town_name).toBe('string');

    townSpy.mockRestore();
    mockFallbackSpy.mockRestore();
  });
});

test('address: house number with single letter suffix', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText')
    .mockImplementation((len) => (len === 1 ? 'A' : 'Testvej'));
  await withMockRandom([0.0, 0.0, 0.9, 0.5], async () => { await fi.setAddress(); });
  textSpy.mockRestore();
  expect(fi.address.number).toMatch(/^[1-9]\d{0,2}[A-Z]$/);
});

test('address: house number without letter suffix', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText').mockReturnValue('Testvej');
  await withMockRandom([0.0, 0.9, 0.9, 0.5, 0.9], async () => { await fi.setAddress(); });
  textSpy.mockRestore();
  expect(fi.address.number).toMatch(/^[1-9]\d{0,2}$/);
});

test('address: floor "st" branch', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText').mockReturnValue('Testvej');
  await withMockRandom([0.0, 0.9, 0.0], async () => { await fi.setAddress(); });
  textSpy.mockRestore();
  expect(fi.address.floor).toBe('st');
});

test('address: door "tv"', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText').mockReturnValue('Testvej');
  const doorType10 = (10 - 1)/20 + 1e-9;
  await withMockRandom([0.0, 0.9, 0.9, 0.5, doorType10], async () => { await fi.setAddress(); });
  textSpy.mockRestore();
  expect(fi.address.door).toBe('tv');
});

test('address: door "mf"', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText').mockReturnValue('Testvej');
  const doorType15 = (15 - 1)/20 + 1e-9;
  await withMockRandom([0.0, 0.9, 0.9, 0.5, doorType15], async () => { await fi.setAddress(); });
  textSpy.mockRestore();
  expect(fi.address.door).toBe('mf');
});

test('address: door numeric at upper bound 50', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText').mockReturnValue('Testvej');
  const doorType17 = (17 - 1)/20 + 1e-9;
  const pick50 = 49/50 + 1e-9;
  await withMockRandom([0.0, 0.9, 0.9, 0.5, doorType17, pick50], async () => { await fi.setAddress(); });
  textSpy.mockRestore();
  expect(fi.address.door).toBe('50');
});

test('address: door pattern without dash (type 19)', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText').mockReturnValue('Testvej');
  const doorType19 = (19 - 1) / 20 + 1e-9;
  await withMockRandom([0.0, 0.9, 0.9, 0.5, doorType19, 0.0, 0.0], async () => { await fi.setAddress(); });
  textSpy.mockRestore();
  expect(fi.address.door).toMatch(/^[a-zøæå]\d{1,3}$/);
});

test('address: door pattern with dash (type 20)', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText').mockReturnValue('Testvej');
  const doorType20 = (20 - 1) / 20 + 1e-9;
  await withMockRandom([0.0, 0.9, 0.9, 0.5, doorType20, 0.0, 0.0], async () => { await fi.setAddress(); });
  textSpy.mockRestore();
  expect(fi.address.door).toMatch(/^[a-zøæå]-\d{1,3}$/);
});

describe('FakeInfo white-box: getRandomText', () => {
  test('first character is never space', () => {
    const s = FakeInfo.getRandomText(12, true);
    expect(s.length).toBe(12);
    expect(s[0]).not.toBe(' ');
  });

  test('includeDanish=false: no æ/ø/å/Æ/Ø/Å appear', () => {
    const s = FakeInfo.getRandomText(200, false);
    expect(/[æøåÆØÅ]/.test(s)).toBe(false);
  });
});

describe('FakeInfo white-box: getFakePersons (clamp)', () => {
  test('amount < 2 clamps to 2; amount > 100 clamps to 100', async () => {
    const low = await FakeInfo.getFakePersons(1);
    expect(low.length).toBe(2);

    const high = await FakeInfo.getFakePersons(101);
    expect(high.length).toBe(100);
  });
});

test('setBirthDate: 31-day month branch', () => {
  const fi = new FakeInfo();
  withMockRandom([0.3, 0.00, 0.3], () => fi.setBirthDate());
  const [, m, d] = fi.birthDate.split('-').map(Number);
  expect([1,3,5,7,8,10,12]).toContain(m);
  expect(d).toBeGreaterThanOrEqual(1);
  expect(d).toBeLessThanOrEqual(31);
});

test('setBirthDate: 30-day month branch', () => {
  const fi = new FakeInfo();
  withMockRandom([0.3, 0.42, 0.3], () => fi.setBirthDate());
  const [, m, d] = fi.birthDate.split('-').map(Number);
  expect([4,6,9,11]).toContain(m);
  expect(d).toBeGreaterThanOrEqual(1);
  expect(d).toBeLessThanOrEqual(30);
});

test('setBirthDate: February branch (1..28)', () => {
  const fi = new FakeInfo();
  withMockRandom([0.3, 0.10, 0.3], () => fi.setBirthDate());
  const [, m, d] = fi.birthDate.split('-').map(Number);
  expect(m).toBe(2);
  expect(d).toBeGreaterThanOrEqual(1);
  expect(d).toBeLessThanOrEqual(28);
});

test('setFullNameAndGender: JSON read failure surfaces', () => {
  const fs = require('fs');
  const fi = new FakeInfo();
  fs.readFileSync.mockImplementationOnce(() => { throw new Error('boom'); });
  expect(() => fi.setFullNameAndGender()).toThrow();
});

test('getter methods return current fields and full person shape', async () => {
  const fi = new FakeInfo();
  const textSpy = jest.spyOn(FakeInfo, 'getRandomText').mockReturnValue('Testvej');
  await fi.setAddress();

  expect(fi.getCpr()).toBe(fi.cpr);

  const g1 = fi.getFullNameAndGender();
  expect(g1).toEqual({
    firstName: fi.firstName,
    lastName:  fi.lastName,
    gender:    fi.gender
  });

  const g2 = fi.getFullNameGenderAndBirthDate();
  expect(g2).toEqual({
    firstName: fi.firstName,
    lastName:  fi.lastName,
    gender:    fi.gender,
    birthDate: fi.birthDate
  });

  const g3 = fi.getCprFullNameAndGender();
  expect(g3).toEqual({
    CPR:       fi.cpr,
    firstName: fi.firstName,
    lastName:  fi.lastName,
    gender:    fi.gender
  });

  const g4 = fi.getCprFullNameGenderAndBirthDate();
  expect(g4).toEqual({
    CPR:       fi.cpr,
    firstName: fi.firstName,
    lastName:  fi.lastName,
    gender:    fi.gender,
    birthDate: fi.birthDate
  });

  const addr = fi.getAddress();
  expect(addr).toHaveProperty('address');
  expect(addr.address).toEqual(fi.address);

  const phone = fi.getPhoneNumber();
  expect(phone).toBe(fi.phone);
  expect(phone).toMatch(/^\d{8}$/);

  const person = fi.getFakePerson();
  expect(person).toEqual(expect.objectContaining({
    CPR:         fi.cpr,
    firstName:   fi.firstName,
    lastName:    fi.lastName,
    gender:      fi.gender,
    birthDate:   fi.birthDate,
    address:     fi.address,
    phoneNumber: fi.phone
  }));

  expect(FakeInfo.getRandomDigit()).toMatch(/^\d$/);

  textSpy.mockRestore();
});

test('setCpr generates birthDate and name/gender when missing', () => {
  const fi = new FakeInfo();

  fi.birthDate = '';
  fi.firstName = '';
  fi.lastName  = '';
  fi.gender    = '';

  // Stub generators to avoid randomness
  const bdSpy = jest.spyOn(fi, 'setBirthDate').mockImplementation(() => {
    fi.birthDate = '2001-01-02';
  });
  const nameSpy = jest.spyOn(fi, 'setFullNameAndGender').mockImplementation(() => {
    fi.firstName = 'Anna';
    fi.lastName  = 'Jensen';
    fi.gender    = FakeInfo.GENDER_FEMININE;
  });

  withMockRandom([0.8, 0.1, 0.1, 0.1], () => fi.setCpr());

  expect(bdSpy).toHaveBeenCalled();
  expect(nameSpy).toHaveBeenCalled();
  expect(fi.cpr).toMatch(/^\d{10}$/);
  expect(fi.cpr.startsWith('020101')).toBe(true);

  bdSpy.mockRestore();
  nameSpy.mockRestore();
});
