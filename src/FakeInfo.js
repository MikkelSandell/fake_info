const fs = require('fs');
const path = require('path');
const Town = require('./Town.js');

/**
 * Class FakeInfo.
 * It generates information about fake persons.
 * 
 * @author  Arturo Mora-Rioja
 * @version 1.0.0 October 2025
 */

// @flow
class FakeInfo {
    static GENDER_FEMININE = 'female';
    static GENDER_MASCULINE = 'male';
    static FILE_PERSON_NAMES = 'data/person-names.json';
    static PHONE_PREFIXES = [
        '2', '30', '31', '40', '41', '42', '50', '51', '52', '53', '60', '61', '71', '81', '91', '92', '93', '342', 
        '344', '345', '346', '347', '348', '349', '356', '357', '359', '362', '365', '366', '389', '398', '431', 
        '441', '462', '466', '468', '472', '474', '476', '478', '485', '486', '488', '489', '493', '494', '495', 
        '496', '498', '499', '542', '543', '545', '551', '552', '556', '571', '572', '573', '574', '577', '579', 
        '584', '586', '587', '589', '597', '598', '627', '629', '641', '649', '658', '662', '663', '664', '665', 
        '667', '692', '693', '694', '697', '771', '772', '782', '783', '785', '786', '788', '789', '826', '827', '829'
    ];
    static MIN_BULK_PERSONS = 2;
    static MAX_BULK_PERSONS = 100;

    constructor() {
        this.cpr = '';
        this.firstName = '';
        this.lastName = '';
        this.gender = '';
        this.birthDate = '';
        this.address = {};
        this.phone = '';
        
        // Initialize non-database dependent data immediately
        this.setFullNameAndGender();
        this.setBirthDate();
        this.setCpr();
        this.setPhone();
    }

    /**
     * Initialize all fake data including address (requires database)
     */
    async initialize() {
        await this.setAddress();
    }

    /**
     * Generates a fake CPR based on the existing birth date and gender.
     * - If no birth date exists, it generates it.
     * - If no first name, last name or gender exists, it generates them.
     */
    setCpr() {
        if (!this.birthDate) {
            this.setBirthDate();        
        }
        if (!this.firstName || !this.lastName || !this.gender) {
            this.setFullNameAndGender();
        }
        // The CPR must end in an even number for females, odd for males
        let finalDigit = Math.floor(Math.random() * 10);
        if (this.gender === FakeInfo.GENDER_FEMININE && finalDigit % 2 === 1) {
            finalDigit++;
            if (finalDigit > 9) finalDigit = 0;
        } else if (this.gender === FakeInfo.GENDER_MASCULINE && finalDigit % 2 === 0) {
            finalDigit++;
            if (finalDigit > 9) finalDigit = 1;
        }
        
        this.cpr = this.birthDate.substring(8, 10) + 
            this.birthDate.substring(5, 7) +
            this.birthDate.substring(2, 4) +
            FakeInfo.getRandomDigit() +
            FakeInfo.getRandomDigit() +
            FakeInfo.getRandomDigit() +
            finalDigit.toString();
    }

    /**
     * Generates a fake date of birth from 1900 to the present year.
     */
    setBirthDate() {
        const currentYear = new Date().getFullYear();
        const year = Math.floor(Math.random() * (currentYear - 1900 + 1)) + 1900;
        const month = Math.floor(Math.random() * 12) + 1;
        
        let day;
        if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
            day = Math.floor(Math.random() * 31) + 1;
        } else if ([4, 6, 9, 11].includes(month)) {
            day = Math.floor(Math.random() * 30) + 1;
        } else {
            // Leap years are not taken into account
            // so as not to overcomplicate the code
            day = Math.floor(Math.random() * 28) + 1;
        }
        
        const date = new Date(year, month - 1, day);
        this.birthDate = date.toISOString().split('T')[0];
    }

    /**
     * Generates a fake full name and gender.
     * - The generation consists in extracting them randomly from the person's JSON file.
     */
    setFullNameAndGender() {
        const filePath = path.join(__dirname, '..', FakeInfo.FILE_PERSON_NAMES);
        const namesData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const person = namesData.persons[Math.floor(Math.random() * namesData.persons.length)];
        
        this.firstName = person.firstName;
        this.lastName = person.lastName;
        this.gender = person.gender;
    }

    /**
     * Generates a fake Danish address
     */
    async setAddress() {
        this.address.street = FakeInfo.getRandomText(40);

        this.address.number = (Math.floor(Math.random() * 999) + 1).toString();
        // Approx. 20% of Danish addresses includes a letter
        if (Math.floor(Math.random() * 10) + 1 < 3) {
            this.address.number += FakeInfo.getRandomText(1, false).toUpperCase();
        }

        // Approx. 30% of Danish addresses are in the ground floor
        if (Math.floor(Math.random() * 10) + 1 < 4) {
            this.address.floor = 'st';
        } else {
            this.address.floor = (Math.floor(Math.random() * 99) + 1).toString();
        }

        /*
            The door will be randomly generated based on the following distribution:
                1-7     35% th
                8-14    35% tv
                15-16   10% mf
                17-18   10% 1-50
                19      5% lowercase_letter + 1-999
                20      5% lowercase letter + '-' + 1-999
        */
        const doorType = Math.floor(Math.random() * 20) + 1;
        if (doorType < 8) {
            this.address.door = 'th';
        } else if (doorType < 15) {
            this.address.door = 'tv';
        } else if (doorType < 17) {
            this.address.door = 'mf';
        } else if (doorType < 19) {
            this.address.door = (Math.floor(Math.random() * 50) + 1).toString();
        } else {
            // The characters need to be laid out in an array instead of a string.
            // Otherwise, the Danish vowels are not correctly interpreted as UTF-8
            const lowerCaseLetters = [
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 
                'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'ø', 'æ', 'å'
            ];
            this.address.door = lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];
            if (doorType === 20) {
                this.address.door += '-';
            }
            this.address.door += (Math.floor(Math.random() * 999) + 1).toString();
        }

        // Postal code and town - try database first, fallback to mock data
        try {
            const town = new Town();
            const townData = await town.getRandomTown();
            this.address.postal_code = townData.postal_code;
            this.address.town_name = townData.town_name;
            await town.disconnect();
        } catch (error) {
            // Fallback to mock data if database is not available
            console.log('Database not available, using mock address data');
            this.setMockAddressData();
        }
    }

    /**
     * Sets mock postal code and town data when database is not available
     */
    setMockAddressData() {
        const mockTowns = [
            { postal_code: '1000', town_name: 'København K' },
            { postal_code: '2000', town_name: 'Frederiksberg' },
            { postal_code: '8000', town_name: 'Aarhus C' },
            { postal_code: '5000', town_name: 'Odense C' },
            { postal_code: '9000', town_name: 'Aalborg' },
            { postal_code: '7000', town_name: 'Fredericia' },
            { postal_code: '3000', town_name: 'Helsingør' },
            { postal_code: '4000', town_name: 'Roskilde' },
            { postal_code: '6000', town_name: 'Kolding' },
            { postal_code: '1050', town_name: 'København K' }
        ];
        
        const randomTown = mockTowns[Math.floor(Math.random() * mockTowns.length)];
        this.address.postal_code = randomTown.postal_code;
        this.address.town_name = randomTown.town_name;
    }
    
    /**
     * Returns a random text.
     * - Only alphabetic characters and the space are allowed
     * 
     * @param  {number} length Length of the text to return (1 by default)
     * @param  {boolean} includeDanishCharacters Whether to include Danish characters
     * @return {string} The random text
     */
    static getRandomText(length = 1, includeDanishCharacters = true) {
        let validCharacters = [
            ' ', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 
            'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 
            'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 
            'Y', 'Z'
        ];
        if (includeDanishCharacters) {
            validCharacters = [...validCharacters, 'æ', 'ø', 'å', 'Æ', 'Ø', 'Å'];
        }

        // The first character is chosen from position 1 to avoid the space
        let text = validCharacters[Math.floor(Math.random() * (validCharacters.length - 1)) + 1];
        for (let index = 1; index < length; index++) {
            text += validCharacters[Math.floor(Math.random() * validCharacters.length)];
        }
        return text;
    }

    /**
     * Generates a fake Danish phone number
     * - The phone number must start with a prefix in PHONE_PREFIXES
     */
    setPhone() {
        let phone = FakeInfo.PHONE_PREFIXES[Math.floor(Math.random() * FakeInfo.PHONE_PREFIXES.length)];
        const prefixLength = phone.length;
        for (let index = 0; index < (8 - prefixLength); index++) {
            phone += FakeInfo.getRandomDigit();
        }

        this.phone = phone;
    }

    /**
     * Returns a fake CPR.
     * - If it does not exist already, it generates a new one.
     * - Since the CPR depends on the date of birth and the gender,
     *   if any of these do not exist, they are also generated
     * 
     * @return {string} The fake CPR
     */
    getCpr() {
        return this.cpr; 
    }
    
    /**
     * Returns a fake full name and gender
     * 
     * @return {object} {firstName: value, lastName: value, gender: 'female' | 'male'}
     */
    getFullNameAndGender() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender
        };
    }

    /**
     * Returns a fake full name, gender, and birth date
     * 
     * @return {object} {firstName: value, lastName: value, gender: 'female' | 'male', birthDate: value}
     */
    getFullNameGenderAndBirthDate() {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            birthDate: this.birthDate
        };
    }

    /**
     * Returns a fake CPR, full name, and gender
     * 
     * @return {object} {CPR: value, firstName: value, lastName: value, gender: 'female' | 'male'}
     */
    getCprFullNameAndGender() {
        return {
            CPR: this.cpr,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender
        };
    }

    /**
     * Returns a fake CPR, full name, gender, and birth date
     * 
     * @return {object} {CPR: value, firstName: value, lastName: value, gender: 'female' | 'male', birthDate: value}
     */
    getCprFullNameGenderAndBirthDate() {
        return {
            CPR: this.cpr,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            birthDate: this.birthDate
        };
    }

    /**
     * Returns a fake Danish address
     * 
     * @return {object} The fake address
     */
    getAddress() {
        return { address: this.address };
    }

    /**
     * Returns a fake Danish phone number
     * 
     * @return {string} The fake phone number
     */
    getPhoneNumber() {
        return this.phone;
    }

    /**
     * Returns fake person information 
     * 
     * @return {object} {CPR: value, firstName: value, lastName: value, gender: 'female'|'male', birthDate: value, phoneNumber: value}
     */
    getFakePerson() {
        return {
            CPR: this.cpr,
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            birthDate: this.birthDate,
            address: this.address,
            phoneNumber: this.phone
        };    
    }

    /** 
     * Returns information about several fake persons
     * 
     * @param {number} amount The number of fake persons to generate, between 2 and 100 inclusive
     * @return {Array} The fake information
     */
    static async getFakePersons(amount = FakeInfo.MIN_BULK_PERSONS) {
        if (amount < FakeInfo.MIN_BULK_PERSONS) { amount = FakeInfo.MIN_BULK_PERSONS; }
        if (amount > FakeInfo.MAX_BULK_PERSONS) { amount = FakeInfo.MAX_BULK_PERSONS; }

        const bulkInfo = [];
        for (let index = 0; index < amount; index++) {
            const fakeInfo = new FakeInfo();
            await fakeInfo.initialize();
            bulkInfo.push(fakeInfo.getFakePerson());
        }
        return bulkInfo;
    }

    /**
     * Generates a random digit as a string
     * 
     * @return {string} The randomly generated digit
     */
    static getRandomDigit() {
        return Math.floor(Math.random() * 10).toString();
    }
}

module.exports = FakeInfo;