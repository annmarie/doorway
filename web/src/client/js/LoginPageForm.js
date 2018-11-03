
class LoginPageForm {
  constructor($el, url) {
    this.FormActionUrl = url + '/login'
    this.$FormBox = $el.querySelector('[data-target=login-page-form]')
    if (!this.$FormBox) return
    this.$Form = this.$FormBox.querySelector('#login-form')
    this.$FormAlert = this.$FormBox.querySelector('[data-target=form-alert]')
    this.$FormSubmit = this.$FormBox.querySelector('[data-action=submit]')
    // bind event
    this.$FormSubmit.onclick = this.submitForm.bind(this)
  }

  submitForm(e) {
    e.preventDefault()
    const form_data = new URLSearchParams(new FormData(this.$Form))
    const $FormAlert = this.$FormAlert

    const submitFailed = (message) => {
      $FormAlert.classList.toggle("hidden", false)
      $FormAlert.innerHTML = message
    }

    fetch(this.FormActionUrl, {
      method: 'POST',
      headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      credentials: 'include',
      body: form_data
    })
      .then(r => r.json())
      .then(data => {
        if (data.auth) window.location.href = this.getReturnUrl()
        else submitFailed(data.message)
      })
      .catch(() => { submitFailed('Something went wrong.') })
  }

  getReturnUrl() {
    const query = window.location.search.substring(1)
    const vars = query.split("&")
    for (let i=0;i<vars.length;i++) {
      const pair = vars[i].split("=")
      if(pair[0] == 'ret') return pair[1]
    }
    return "/"
  }
}

module.exports = LoginPageForm
