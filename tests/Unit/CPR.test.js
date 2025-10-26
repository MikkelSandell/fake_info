// @flow

const FakeInfo = require("../../src/FakeInfo");



test("the different attributes of a CPR", async ()=>{

    let person= new FakeInfo()


      const CPR = person.getCpr().replace("-", ""); // Remove optional dash
      const [year, month, day] = person.birthDate.split("-");
      
      // Convert YYYY-MM-DD → DDMMYY
      const pattern = `${day}${month}${year.slice(-2)}`;
      expect(typeof pattern).toBe("string");
      const regex = new RegExp(pattern);
      const value = regex.test(CPR);
      expect(value).toBe(true);
    
})