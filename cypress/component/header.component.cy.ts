import { HeaderComponent } from '../../src/app/components/header/header.component'
import { HomeService } from '../../src/app/services/home.service'
import { AuthService } from '../../src/app/services/auth.service'
import { Router } from '@angular/router'
import { of } from 'rxjs'

describe('HeaderComponent', () => {
  let mockHomeService: jasmine.SpyObj<HomeService>
  let mockAuthService: jasmine.SpyObj<AuthService>
  let mockRouter: jasmine.SpyObj<Router>

  beforeEach(() => {
    // Create spies for services
    mockHomeService = jasmine.createSpyObj('HomeService', ['getCategoriasPortada'])
    mockAuthService = jasmine.createSpyObj('AuthService', ['logout'])
    mockRouter = jasmine.createSpyObj('Router', ['navigate'])

    // Setup default return values
    mockHomeService.getCategoriasPortada.and.returnValue(of([
      { id: 1, nombre: 'Programación' },
      { id: 2, nombre: 'Diseño' }
    ]))
  })

  it('should mount', () => {
    cy.mount(HeaderComponent, {
      providers: [
        { provide: HomeService, useValue: mockHomeService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
  })

  it('should load categories on init', () => {
    cy.mount(HeaderComponent, {
      providers: [
        { provide: HomeService, useValue: mockHomeService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).then(() => {
      expect(mockHomeService.getCategoriasPortada).to.have.been.called
    })
  })

  it('should detect login status correctly when logged in', () => {
    // Set localStorage to simulate logged in user
    cy.window().then((win) => {
      win.localStorage.setItem('isLoggedIn', 'true')
    })

    cy.mount(HeaderComponent, {
      providers: [
        { provide: HomeService, useValue: mockHomeService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).then((wrapper) => {
      expect(wrapper.component.isLogin()).to.be.true
    })
  })

  it('should detect login status correctly when not logged in', () => {
    // Clear localStorage to simulate not logged in
    cy.window().then((win) => {
      win.localStorage.removeItem('isLoggedIn')
    })

    cy.mount(HeaderComponent, {
      providers: [
        { provide: HomeService, useValue: mockHomeService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).then((wrapper) => {
      expect(wrapper.component.isLogin()).to.be.false
    })
  })

  it('should call logout service and navigate on logout', () => {
    cy.mount(HeaderComponent, {
      providers: [
        { provide: HomeService, useValue: mockHomeService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).then((wrapper) => {
      wrapper.component.logout()
      expect(mockAuthService.logout).to.have.been.called
      expect(mockRouter.navigate).to.have.been.calledWith(['/home'])
    })
  })
})