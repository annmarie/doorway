const LoginPageForm = require('./LoginPageForm')

const apiurl = '/api'  // set the api url
const webauthurl = '/auth' // set the webauth url
const $el = document.querySelector('[data-target=main]')

// init forms
new LoginPageForm($el, webauthurl)

display_setup() // setup displays

function display_setup() {
  const $authDisplay = $el.querySelector('[data-target=auth-display]')
  if (!$authDisplay) return
  const $isAuthDisplay = $authDisplay.querySelector('[data-target=is-auth-display]')
  const $notAuthDisplay = $authDisplay.querySelector('[data-target=not-auth-display]')
  const $authToken = $authDisplay.querySelector('[data-target=authtoken]')
  $notAuthDisplay.classList.toggle("hidden", false)
  $isAuthDisplay.classList.toggle("hidden", true)
  fetch(webauthurl + '/me', { method: 'get', credentials: 'include' })
    .then(r => r.json())
    .then(rset => rset)
    .catch(() => {})
    .then(rset => {
      if (rset.auth) { // user is logged in
        $isAuthDisplay.classList.toggle("hidden", false)
        $isAuthDisplay.querySelector('[data-target=auth-user-email]').innerHTML = rset.me.email
        $isAuthDisplay.querySelector('[data-target=authtoken]').value = rset.me.authtoken
        $notAuthDisplay.classList.toggle("hidden", true)

        // if daily prices display container is on the page
        const $dailyPriceContainer = $el.querySelector('[data-target=daily-prices-container]')
        if ($dailyPriceContainer) dailypricesdisplay($el, apiurl)

        // if tokens display container is on the page
        const $tokenListContainer = $el.querySelector('[data-target=tokens-list-container]')
        if ($tokenListContainer) tokendatabasedisplay($el, apiurl)

      } else { // user is not logged in
        $isAuthDisplay.classList.toggle("hidden", true)
        $isAuthDisplay.querySelector('[data-target=auth-user-email]').innerHTML = ""
        $notAuthDisplay.classList.toggle("hidden", false)
      }

    })
}
