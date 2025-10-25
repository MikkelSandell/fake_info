const FakeInfo= require('../../src/FakeInfo');



test("counting the numbers in a phonenumber",()=>{

    const phone=new FakeInfo().phone
    const phonecount = phone.match(/[0-9]/g)
    const digits= phonecount.length
    expect(digits).toBe(8)  
});