import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import RegisterPage from '@/views/RegisterPage'

// vm.$router에 접근할 수 있도록
// 테스트에 Vue Router 추가하기
const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter()

// registrationService의 목
jest.mock('@/services/registration')

describe('RegisterPage.vue', () => {
  let wrapper
  let fieldUsername
  let fieldEmailAddress
  let fieldPassword
  let buttonSubmit

  beforeEach(() => {
    wrapper = mount(RegisterPage, {
      localVue,
      router
    })
    fieldUsername = wrapper.find('#username')
    fieldEmailAddress = wrapper.find('#emailAddress')
    fieldPassword = wrapper.find('#password')
    buttonSubmit = wrapper.find('form button[type="submit"]')
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should render registration form', () => {
    expect(wrapper.find('.logo').attributes().src).toEqual(
      '/static/images/logo.png'
    )
    expect(wrapper.find('.tagline').text()).toEqual(
      'Open source task management tool'
    )
    expect(fieldUsername.element.value).toEqual('')
    expect(fieldEmailAddress.element.value).toEqual('')
    expect(fieldPassword.element.value).toEqual('')
    expect(buttonSubmit.text()).toEqual('Create account')
  })

  it('should contain data model with initial values', () => {
    expect(wrapper.vm.form.username).toEqual('')
    expect(wrapper.vm.form.emailAddress).toEqual('')
    expect(wrapper.vm.form.password).toEqual('')
  })

  it('should have form inputs bound with data model', async () => {
    const username = 'sunny'
    const emailAddress = 'sunny@local'
    const password = 'VueJsRocks'
    await wrapper.setData({
      form: {
        username: username,
        emailAddress: emailAddress,
        password: password
      }
    })
    expect(fieldUsername.element.value).toEqual(username)
    expect(fieldEmailAddress.element.value).toEqual(emailAddress)
    expect(fieldPassword.element.value).toEqual(password)
  })

  it('should have form submit event handler `submitForm`', () => {
    const spySubmitForm = jest.spyOn(wrapper.vm, 'submitForm')
    wrapper.vm.submitForm()
    expect(spySubmitForm).toHaveBeenCalled()
  })

  it('should register when it is a new user', async () => {
    const stub = jest.fn()
    wrapper.vm.$router.push = stub
    // Vue는 비동기라서 await 처리를 해줘야 한다
    await wrapper.setData({
      form: {
        username: 'sunny',
        emailAddress: 'sunny@local',
        password: 'Jest!'
      }
    })

    wrapper.vm.submitForm()
    wrapper.vm.$nextTick(() => {
      expect(stub).toHaveBeenCalledWith({ name: 'LoginPage' })
    })
  })

  it('should fail it is not a new user', () => {
    // 목에서는 오직 sunny@local만 새로운 사용자다
    wrapper.vm.form.emailAddress = 'ted@local'
    expect(wrapper.find('.failed').isVisible()).toBe(false)
    wrapper.vm.submitForm()
    wrapper.vm.$nextTick(null, () => {
      expect(wrapper.find('.failed').isVisible()).toBe(true)
    })
  })
})
