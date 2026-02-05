const chaldean = {'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8};
let user = {};

// अंकों को सिंगल डिजिट में बदलना
function reduce(n) {
    while (n > 9) { n = n.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0); }
    return n;
}

// लाइव नामांक गणना
window.liveCalc = function() {
    let name = document.getElementById('nameInp').value.toUpperCase().replace(/\s/g, '');
    let sum = 0;
    for (let char of name) { if (chaldean[char]) sum += chaldean[char]; }
    document.getElementById('nameLive').innerText = name ? `(${sum} ~ ${reduce(sum)})` : "";
};

// रिपोर्ट मेन्यू दिखाना
window.generateMenu = function() {
    const name = document.getElementById('nameInp').value;
    const dob = document.getElementById('dobInp').value;
    if (!name || !dob) return alert("कृपया सभी जानकारी भरें");

    const [y, m, d] = dob.split('-');
    user = {
        name: name,
        mulank: reduce(parseInt(d)),
        bhagyank: reduce(parseInt(d) + parseInt(m) + y.split('').reduce((a,b)=>parseInt(a)+parseInt(b), 0)),
        namank: reduce([...name.toUpperCase()].reduce((s,c) => s + (chaldean[c]||0), 0)),
        dob: dob
    };

    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
};

// डिटेल विंडो खोलना (Locked/Free Logic)
window.openDetail = function(type, isPaid) {
    let body = document.getElementById('modalBody');
    if (isPaid) {
        body.innerHTML = `
            <h2 class="gold-text">प्रीमियम लॉक 🔒</h2>
            <div class="pay-box">
                <p>यह जानकारी और उपाय केवल प्रीमियम रिपोर्ट में उपलब्ध हैं।</p>
                <h3 style="color:var(--gold); font-size:1.8rem;">₹199</h3>
                <button class="btn-main" onclick="alert('UPI पेमेंट गेटवे यहाँ जुड़ेगा')">अनलॉक करें</button>
            </div>
        `;
    } else {
        if(type === 'mulank') body.innerHTML = `<h2 class="gold-text">मूलांक: ${user.mulank}</h2><p>यह आपके जन्म का अंक है जो आपके स्वभाव को दर्शाता है।</p>`;
        if(type === 'bhagyank') body.innerHTML = `<h2 class="gold-text">भाग्यांक: ${user.bhagyank}</h2><p>यह आपके जीवन का मार्ग (Path) है।</p>`;
        if(type === 'namank') body.innerHTML = `<h2 class="gold-text">नामांक: ${user.namank}</h2><p>आपके नाम की ऊर्जा आपके जीवन को प्रभावित करती है।</p>`;
        if(type === 'missing') body.innerHTML = `<h2 class="gold-text">लुप्त संख्या (Missing)</h2><p>आपकी जन्मतिथि में कुछ अंक लुप्त हैं, उनके उपाय फ्री में यहाँ देखें...</p>`;
    }
    document.getElementById('detailModal').style.display = 'block';
};

window.closeModal = function() { document.getElementById('detailModal').style.display = 'none'; };
          
