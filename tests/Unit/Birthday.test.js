const FakeInfo= require('../../src/FakeInfo');



test("meassuring the correct birthday,month and year",async ()=>{

    const fake = new FakeInfo();

    const Fake =new FakeInfo()
    const regex = /^(19[0-9]{2}|20[0-1][0-9]|202[0-5])-(0[1-9]|[1-2][0-9])-(0[1-9]|[12][0-9]|3[01])$/;

    const value = regex.test(Fake.birthDate);
    expect(value).toBe(true);
})