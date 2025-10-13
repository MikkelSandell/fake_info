describe('Partial Generation Dropdown Options Tests', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:5500/index.html')
    cy.get('#txtNumberPersons').clear().type('1')
    
    // Select partial options mode before each test
    cy.get('#chkPartialOptions').click()
  })

  describe('Individual Dropdown Option Tests', () => {
    it('should generate CPR only', () => {
      cy.get('#cmbPartialOptions').select('cpr')
      cy.get('input[type="submit"]').click()
      
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('exist')
      
      // Should show CPR data
      cy.get('.cpr').should('not.have.class', 'hidden')
      cy.get('.cprValue').should('not.have.class', 'hidden').invoke('text').should('match', /\d{10}/)
      
      // Should NOT show other data (should remain hidden)
      cy.get('.firstName').should('have.class', 'hidden')
      cy.get('.lastName').should('have.class', 'hidden')
      cy.get('.gender').should('have.class', 'hidden')
      cy.get('.address').should('have.class', 'hidden')
      cy.get('.phoneNumber').should('have.class', 'hidden')
    })

    it('should generate name and gender only', () => {
      cy.get('#cmbPartialOptions').select('name-gender')
      cy.get('input[type="submit"]').click()
      
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('exist')
      
      // Should show name and gender data
      cy.get('.firstName').should('not.have.class', 'hidden')
      cy.get('.firstNameValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.lastName').should('not.have.class', 'hidden')
      cy.get('.lastNameValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.gender').should('not.have.class', 'hidden')
      cy.get('.genderValue').should('not.have.class', 'hidden').invoke('text').should('match', /male|female/i)
      
      // Should NOT show other data
      cy.get('.cpr').should('have.class', 'hidden')
      cy.get('.dob').should('have.class', 'hidden')
      cy.get('.address').should('have.class', 'hidden')
      cy.get('.phoneNumber').should('have.class', 'hidden')
    })

    it('should generate name, gender and date of birth', () => {
      cy.get('#cmbPartialOptions').select('name-gender-dob')
      cy.get('input[type="submit"]').click()
      
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('exist')
      
      // Should show name, gender and DOB data
      cy.get('.firstName').should('not.have.class', 'hidden')
      cy.get('.firstNameValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.lastName').should('not.have.class', 'hidden')
      cy.get('.lastNameValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.gender').should('not.have.class', 'hidden')
      cy.get('.genderValue').should('not.have.class', 'hidden').invoke('text').should('match', /male|female/i)
      cy.get('.dob').should('not.have.class', 'hidden')
      cy.get('.dobValue').should('not.have.class', 'hidden').invoke('text').should('match', /\d{4}-\d{2}-\d{2}/)
      
      // Should NOT show other data
      cy.get('.cpr').should('have.class', 'hidden')
      cy.get('.address').should('have.class', 'hidden')
      cy.get('.phoneNumber').should('have.class', 'hidden')
    })

    it('should generate CPR, name and gender', () => {
      cy.get('#cmbPartialOptions').select('cpr-name-gender')
      cy.get('input[type="submit"]').click()
      
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('exist')
      
      // Should show CPR, name and gender data
      cy.get('.cpr').should('not.have.class', 'hidden')
      cy.get('.cprValue').should('not.have.class', 'hidden').invoke('text').should('match', /\d{10}/)
      cy.get('.firstName').should('not.have.class', 'hidden')
      cy.get('.firstNameValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.lastName').should('not.have.class', 'hidden')
      cy.get('.lastNameValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.gender').should('not.have.class', 'hidden')
      cy.get('.genderValue').should('not.have.class', 'hidden').invoke('text').should('match', /male|female/i)
      
      // Should NOT show other data
      cy.get('.dob').should('have.class', 'hidden')
      cy.get('.address').should('have.class', 'hidden')
      cy.get('.phoneNumber').should('have.class', 'hidden')
    })

    it('should generate CPR, name, gender and date of birth', () => {
      cy.get('#cmbPartialOptions').select('cpr-name-gender-dob')
      cy.get('input[type="submit"]').click()
      
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('exist')
      
      // Should show CPR, name, gender and DOB data
      cy.get('.cpr').should('not.have.class', 'hidden')
      cy.get('.cprValue').should('not.have.class', 'hidden').invoke('text').should('match', /\d{10}/)
      cy.get('.firstName').should('not.have.class', 'hidden')
      cy.get('.firstNameValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.lastName').should('not.have.class', 'hidden')
      cy.get('.lastNameValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.gender').should('not.have.class', 'hidden')
      cy.get('.genderValue').should('not.have.class', 'hidden').invoke('text').should('match', /male|female/i)
      cy.get('.dob').should('not.have.class', 'hidden')
      cy.get('.dobValue').should('not.have.class', 'hidden').invoke('text').should('match', /\d{4}-\d{2}-\d{2}/)
      
      // Should NOT show other data
      cy.get('.address').should('have.class', 'hidden')
      cy.get('.phoneNumber').should('have.class', 'hidden')
    })

    it('should generate address only', () => {
      cy.get('#cmbPartialOptions').select('address')
      cy.get('input[type="submit"]').click()
      
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('exist')
      
      // Should show address data
      cy.get('.address').should('not.have.class', 'hidden')
      cy.get('.streetValue').should('not.have.class', 'hidden').and('not.be.empty')
      cy.get('.townValue').should('not.have.class', 'hidden').invoke('text').should('match', /\d{4}/) // Postal code
      
      // Should NOT show other data
      cy.get('.cpr').should('have.class', 'hidden')
      cy.get('.firstName').should('have.class', 'hidden')
      cy.get('.lastName').should('have.class', 'hidden')
      cy.get('.gender').should('have.class', 'hidden')
      cy.get('.dob').should('have.class', 'hidden')
      cy.get('.phoneNumber').should('have.class', 'hidden')
    })

    it('should generate phone number only', () => {
      cy.get('#cmbPartialOptions').select('phone')
      cy.get('input[type="submit"]').click()
      
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('exist')
      
      // Should show phone number data
      cy.get('.phoneNumber').should('not.have.class', 'hidden')
      cy.get('.phoneNumberValue').should('not.have.class', 'hidden').invoke('text').should('match', /\d{8}/)
      
      // Should NOT show other data
      cy.get('.cpr').should('have.class', 'hidden')
      cy.get('.firstName').should('have.class', 'hidden')
      cy.get('.lastName').should('have.class', 'hidden')
      cy.get('.gender').should('have.class', 'hidden')
      cy.get('.dob').should('have.class', 'hidden')
      cy.get('.address').should('have.class', 'hidden')
    })
  })

  describe('Dropdown Functionality Tests', () => {
    it('should have all partial generation options available', () => {
      cy.get('#cmbPartialOptions option').should('have.length', 7)
      cy.get('#cmbPartialOptions option[value="cpr"]').should('exist').and('contain.text', 'CPR')
      cy.get('#cmbPartialOptions option[value="name-gender"]').should('exist').and('contain.text', 'Name and gender')
      cy.get('#cmbPartialOptions option[value="name-gender-dob"]').should('exist').and('contain.text', 'Name, gender and birthdate')
      cy.get('#cmbPartialOptions option[value="cpr-name-gender"]').should('exist').and('contain.text', 'CPR, name and gender')
      cy.get('#cmbPartialOptions option[value="cpr-name-gender-dob"]').should('exist').and('contain.text', 'CPR, name, gender, birthdate')
      cy.get('#cmbPartialOptions option[value="address"]').should('exist').and('contain.text', 'Address')
      cy.get('#cmbPartialOptions option[value="phone"]').should('exist').and('contain.text', 'Phone number')
    })

    it('should allow switching between different dropdown options', () => {
      // Test switching between options
      cy.get('#cmbPartialOptions').select('cpr')
      cy.get('#cmbPartialOptions').should('have.value', 'cpr')
      
      cy.get('#cmbPartialOptions').select('name-gender')
      cy.get('#cmbPartialOptions').should('have.value', 'name-gender')
      
      cy.get('#cmbPartialOptions').select('address')
      cy.get('#cmbPartialOptions').should('have.value', 'address')
      
      cy.get('#cmbPartialOptions').select('phone')
      cy.get('#cmbPartialOptions').should('have.value', 'phone')
    })

    it('should have CPR selected by default', () => {
      cy.get('#cmbPartialOptions').should('have.value', 'cpr')
      cy.get('#cmbPartialOptions option[value="cpr"]').should('be.selected')
    })
  })

  describe('Multiple Persons Generation', () => {
    beforeEach(() => {
      // Reset to person mode for this test (override the main beforeEach)
      cy.visit('http://127.0.0.1:5500/index.html')
      cy.get('#txtNumberPersons').clear().type('1')
      // Don't click partial options - stay in person mode
    })

    it('should generate multiple complete persons', () => {
      // Make sure we're in person mode (not partial options)
      cy.get('#chkPerson').should('be.checked')
      
      cy.get('#txtNumberPersons').clear().type('3')
      cy.get('input[type="submit"]').click()
      
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('have.length', 3)
      
      // Check that all cards show complete person data (all fields visible)
      cy.get('.personCard').each($card => {
        cy.wrap($card).within(() => {
          cy.get('.firstName').should('not.have.class', 'hidden')
          cy.get('.lastName').should('not.have.class', 'hidden')
          cy.get('.gender').should('not.have.class', 'hidden')
          cy.get('.cpr').should('not.have.class', 'hidden')
          cy.get('.address').should('not.have.class', 'hidden')
          cy.get('.phoneNumber').should('not.have.class', 'hidden')
        })
      })
    })

    it('should generate 100 complete persons (maximum limit)', () => {
      // Make sure we're in person mode (not partial options)
      cy.get('#chkPerson').should('be.checked')
      
      cy.get('#txtNumberPersons').clear().type('100')
      cy.get('input[type="submit"]').click()
      
      // Wait for output to be visible and all cards to load
      cy.get('#output').should('not.have.class', 'hidden')
      cy.get('.personCard').should('have.length', 100)
      
      // Verify that we have exactly 100 persons
      cy.get('.personCard').should('have.length', 100)
      
      // Check first few and last few cards to ensure all data is present
      cy.get('.personCard').first().within(() => {
        cy.get('.firstName').should('not.have.class', 'hidden')
        cy.get('.lastName').should('not.have.class', 'hidden')
        cy.get('.gender').should('not.have.class', 'hidden')
        cy.get('.cpr').should('not.have.class', 'hidden')
        cy.get('.address').should('not.have.class', 'hidden')
        cy.get('.phoneNumber').should('not.have.class', 'hidden')
      })
      
      cy.get('.personCard').last().within(() => {
        cy.get('.firstName').should('not.have.class', 'hidden')
        cy.get('.lastName').should('not.have.class', 'hidden')
        cy.get('.gender').should('not.have.class', 'hidden')
        cy.get('.cpr').should('not.have.class', 'hidden')
        cy.get('.address').should('not.have.class', 'hidden')
        cy.get('.phoneNumber').should('not.have.class', 'hidden')
      })
      
      // Verify some middle cards to ensure consistency
      cy.get('.personCard').eq(49).within(() => { // 50th card (0-indexed)
        cy.get('.firstName').should('not.have.class', 'hidden')
        cy.get('.cpr').should('not.have.class', 'hidden')
      })
      
      // Check that all CPR values are unique (spot check first 10)
      cy.get('.personCard').then($cards => {
        const cprValues = []
        // Check first 10 cards for CPR uniqueness
        for (let i = 0; i < Math.min(10, $cards.length); i++) {
          cy.wrap($cards.eq(i)).find('.cprValue').invoke('text').then(cpr => {
            expect(cprValues).to.not.include(cpr, `CPR ${cpr} should be unique`)
            cprValues.push(cpr)
          })
        }
      })
    })
  })
})