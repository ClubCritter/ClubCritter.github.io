class KadenaSpireKey {
  constructor(spireKeyHostname, returnUrl) {
    this._spireKeyHostname = spireKeyHostname;
    this._returnUrl = returnUrl;
    this._user = null;
    this._transactions = {};
    this._loadFromLocalStorage();
    this.update(window.location);
  }

  get isLoggedIn() {
    return this._user !== null;
  }

  get user() {
    return this._user;
  }

  get transactions() {
    return this._transactions;
  }

  update(location) {
    const searchParams = new URLSearchParams(location.search);

    if (searchParams.has('user')) {
      const userSearch = searchParams.get('user');
      if (userSearch && userSearch.length > 0) {
        this._user = JSON.parse(decodeBase64(userSearch));
        console.log('retrieved user from querystring parameters', this._user);
      }
    }

    if (searchParams.has('transaction')) {
      const transactionSearch = searchParams.get('transaction');
      if (transactionSearch && transactionSearch.length > 0) {
        const transaction = JSON.parse(decodeBase64(transactionSearch));
        console.log(
          'retrieved transaction from querystring parameters',
          JSON.stringify(transaction, null, 2),
        );
        this._transactions[transaction.hash] = transaction;
      }
    }
    this._saveToLocalStorage();
    history.pushState({}, '', location.pathname);
  }

  login() {
    location.href = `${this._spireKeyHostname}/connect?returnUrl=${this._returnUrl}`;
  }

  loginOptimistic() {
    location.href = `${this._spireKeyHostname}/connect?returnUrl=${this._returnUrl}&optimistic=true`;
  }

  logout() {
    this._clearLocalStorage();
    this._user = null;
    this._transactions = {};
    setTimeout(() => {
      location.href = new URL(this._returnUrl).origin;
    }, 100); // Adding a short delay to ensure state updates before redirect
  }

  sign(tx) {
    const query = {
      transaction: encodeBase64(JSON.stringify(tx)),
      returnUrl: this._returnUrl,
      optimistic: false,
    };
    const queryString = new URLSearchParams(query).toString();
    location.href = `${this._spireKeyHostname}/sign?${queryString}`;
  }

  _saveToLocalStorage() {
    sessionStorage.setItem('spirekey_user', JSON.stringify(this._user));
    sessionStorage.setItem('spirekey_transactions', JSON.stringify(this._transactions));
  }

  _loadFromLocalStorage() {
    const user = sessionStorage.getItem('spirekey_user');
    if (user) {
      this._user = JSON.parse(user);
    }

    const transactions = sessionStorage.getItem('spirekey_transactions');
    if (transactions) {
      this._transactions = JSON.parse(transactions);
    }
  }

  _clearLocalStorage() {
    sessionStorage.removeItem('spirekey_user');
    sessionStorage.removeItem('spirekey_transactions');
  }
}

function decodeBase64(msg) {
  return atob(msg);
}

function encodeBase64(msg) {
  return btoa(msg);
}

export { KadenaSpireKey };
