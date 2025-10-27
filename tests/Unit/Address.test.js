

const  FakeInfo= require('../../src/FakeInfo');



test("the different attributes of an address town",async ()=>{
    const fake = new FakeInfo();
    if (typeof fake.initialize === 'function') await fake.initialize();

    const res = fake.getAddress();
    const town = res.address.town_name
    expect(town).toBeDefined(); 
    expect(typeof town).toBe('string');

    const letter = /\p{L}/u.test(town)
    expect(letter).toBe(true)

});

test("the different attributes of a street",async ()=>{
    const fake = new FakeInfo();
    if (typeof fake.initialize === 'function') await fake.initialize();

    const res = await fake.getAddress();
    const street = res.address.street
    expect(street).toBeDefined(); 
    expect(typeof street).toBe('string');
    console.log(street)

    const hasLetter = /\p{L}/u.test(street);
    expect(hasLetter).toBe(true)

});

test("the different attributes of a number",async ()=>{
    const fake = new FakeInfo();
    if (typeof fake.initialize === 'function') await fake.initialize();

    const res = await  fake.getAddress();
    const street = res.address.number
    expect(street).toBeDefined(); 
    expect(typeof street).toBe('string');

    const hasLetter =/(\d{1,3}(?:\p{Lu})?)/u.test(street);
    expect(hasLetter).toBe(true);

});

test("the different attributes of a floor",async ()=>{
    const fake = new FakeInfo();
    if (typeof fake.initialize === 'function') await fake.initialize();

    const res = await  fake.getAddress();
    const floor = res.address.floor
    expect(floor).toBeDefined(); 
    expect(typeof floor).toBe('string');

    const hasLetter =/^(\d{1,2}|st)$/.test(floor);
    expect(hasLetter).toBe(true);

});


test("the different attributes of a door",async ()=>{
    const fake = new FakeInfo();
    if (typeof fake.initialize === 'function') await fake.initialize();

    const res = await  fake.getAddress();
    const thedoor = res.address.door
    expect(thedoor).toBeDefined(); 
    expect(typeof thedoor).toBe('string');

    const hasLetter =/^(th|mf|tv|[1-9]|[1-4][0-9]|50|\p{Ll}-?\d{1,3})$/u.test(thedoor);
    expect(hasLetter).toBe(true);

});


test("the different attributes of a postalcode",async ()=>{
    const fake = new FakeInfo();
    if (typeof fake.initialize === 'function') await fake.initialize();

    const res = await fake.getAddress();
    const code = res.address.postal_code
    expect(code).toBeDefined(); 
    expect(typeof code).toBe('string');

    const hasLetter =/(\d{4})/.test(code);
    expect(hasLetter).toBe(true);

});


