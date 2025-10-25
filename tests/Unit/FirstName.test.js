const  FakeInfo= require('../../src/FakeInfo');

test("the different attributes of an address",async ()=>{
    const fake = new FakeInfo();
    if (typeof fake.initialize === 'function') await fake.initialize();

    const name =fake.firstName
    expect(typeof name).toBe('string');

    const letter =  /\p{L}/u.test(name)
    expect(letter).toBe(true)
})

test("the different attributes of an address",async ()=>{
    const fake = new FakeInfo();

    const name =fake.lastName
    expect(typeof name).toBe('string');

    const letter = /\p{L}/u.test(name)
    expect(letter).toBe(true)
})

test("the different attributes of an address",async ()=>{
    const fake = new FakeInfo();
    if (typeof fake.initialize === 'function') await fake.initialize();

    const name =fake.gender
    expect(typeof name).toBe('string');

    const letter = /(female)|(male)/g.test(name)
    expect(letter).toBe(true)
})