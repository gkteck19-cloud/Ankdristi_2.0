// 1. Firebase Configuration (गौतम जी की सेटिंग्स)
const firebaseConfig = {
  apiKey: "AIzaSyCJIfQ-UTS6ns0pRO0nH4wzUQNnBB4_plc",
  authDomain: "ankdristi-37446610-e3f3b.firebaseapp.com",
  projectId: "ankdristi-37446610-e3f3b",
  storageBucket: "ankdristi-37446610-e3f3b.firebasestorage.app",
  messagingSenderId: "216216154216",
  appId: "1:216216154216:web:c6d5ffde5dc4faf13dcbdd"
};

// 2. Firebase Initialize (CDN version for browser)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. स्प्लैश स्क्रीन टाइमर
window.addEventListener('load', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 800);
        }
    }, 2500);
});

let selectedGender = "";
const charMap = { A:1, I:1, J:1, Q:1, Y:1, B:2, K:2, R:2, C:3, G:3, L:3, S:3, D:4, M:4, T:4, E:5, H:5, N:5, X:5, U:6, V:6, W:6, O:7, Z:7, P:8, F:8 };
const remedies = { 1:"सूर्य को जल दें", 2:"चांदी धारण करें", 3:"केसर तिलक लगाएं", 4:"पक्षी सेवा करें", 5:"गाय को हरा चारा दें", 6:"इत्र का प्रयोग करें", 7:"कुत्ता सेवा करें", 8:"शनि दीप जलाएं", 9:"हनुमान चालीसा पढ़ें" };

function selectGender(g) {
    selectedGender = g;
    document.getElementById('maleBtn').classList.toggle('active', g === 'Male');
    document.getElementById('femaleBtn').classList.toggle('active', g === 'Female');
}

function reduce(n) {
    while (n > 9) n = n.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    return n;
}

function calculateLiveNamank(name) {
    let sum = 0;
    let clean = name.toUpperCase().replace(/[^A-Z]/g, '');
    for (let char of clean) sum += charMap[char] || 0;
    document.getElementById('namankDisplay').innerText = sum > 0 ? `${sum} (${reduce(sum)})` : "0 (0)";
    return { total: sum, single: reduce(sum) };
}

function showResults() {
    const name = document.getElementById('userName').value;
    const dob = document.getElementById('userDOB').value;
    if (!name || !dob || !selectedGender) { alert("पूरी जानकारी भरें"); return; }
    
    const nObj = calculateLiveNamank(name);
    const d = parseInt(dob.split('-')[2]);
    const fullSum = dob.replace(/-/g, '').split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    
    document.getElementById('resMulank').innerText = reduce(d);
    document.getElementById('resBhagyank').innerText = reduce(fullSum);
    document.getElementById('resNamank').innerText = `${nObj.total} (${nObj.single})`;
    
    document.getElementById('input-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
}

function openDetail(type) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const dobDigits = document.getElementById('userDOB').value.replace(/-/g, '');
    const allPresent = dobDigits + document.getElementById('resMulank').innerText + document.getElementById('resBhagyank').innerText;
    
    let head = "", content = "";
    
    if(type === 'missing') {
        head = "लुप्त अंक (Missing)";
        let missing = [];
        for(let i=1; i<=9; i++) if(!allPresent.includes(i)) missing.push(i);
        content = missing.length ? missing.map(n => `<span class='missing-circle'>${n}</span>`).join(' ') : "अदभुत! कोई अंक मिसिंग नहीं है।";
    } else if(type === 'remedy') {
        head = "सरल उपाय";
        let missing = [];
        for(let i=1; i<=9; i++) if(!allPresent.includes(i)) missing.push(`<b>अंक ${i}:</b> ${remedies[i]}`);
        content = missing.length ? missing.join('<br>') : "नियमित ध्यान और योग करें।";
    } else {
        head = "विश्लेषण";
        content = "यह आपके " + type + " का संक्षिप्त विवरण है। पूर्ण जानकारी प्रीमियम रिपोर्ट में उपलब्ध है।";
    }

    title.innerText = head;
    body.innerHTML = content;
    modal.classList.remove('hidden');
}

function closeModal() { document.getElementById('infoModal').classList.add('hidden'); }
function goBack() { document.getElementById('result-page').classList.add('hidden'); document.getElementById('input-page').classList.remove('hidden'); }
function contactPremium() { window.open('https://wa.me/91XXXXXXXXXX?text=नमस्ते, मुझे प्रीमियम रिपोर्ट चाहिए।'); }
      
// 4. लाइव नामांक गणना (Chaldean Method)
window.liveCalc = function() {
    const name = document.getElementById('nameInp').value.toUpperCase();
    const chart = {'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8};
    
    let total = 0;
    for (let char of name) {
        if (chart[char]) total += chart[char];
    }
    
    const singleDigit = calculateReduction(total);
    document.getElementById('nameLive').innerText = name ? `(${total} > ${singleDigit})` : "";
};

// 5. रिपोर्ट जेनरेट करना
window.generateMenu = async function() {
    const name = document.getElementById('nameInp').value;
    const dob = document.getElementById('dobInp').value;
    const gender = document.getElementById('genderInp').value;

    if (!name || !dob) {
        alert("कृपया नाम और जन्म तिथि भरें।");
        return;
    }

    const [y, m, d] = dob.split('-');

    // डेटा स्टोर करें
    user.name = name;
    user.dob = dob;
    user.gender = gender;
    user.mulank = calculateReduction(d);
    user.bhagyank = calculateReduction(parseInt(d) + parseInt(m) + [...y].reduce((a,b)=>parseInt(a)+parseInt(b), 0));
    
    // नामांक फाइनल करें
    const chart = {'A':1,'I':1,'J':1,'Q':1,'Y':1,'B':2,'K':2,'R':2,'C':3,'G':3,'L':3,'S':3,'D':4,'M':4,'T':4,'E':5,'H':5,'N':5,'X':5,'U':6,'V':6,'W':6,'O':7,'Z':7,'F':8,'P':8};
    let nameSum = [...name.toUpperCase()].reduce((s, c) => s + (chart[c] || 0), 0);
    user.namank = calculateReduction(nameSum);

    // UI बदलें
    document.getElementById('home-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');

    // Firebase में डेटा सेव करें
    try {
        await addDoc(collection(db, "user_queries"), {
            ...user,
            timestamp: new Date(),
            app: "Ankdristi_2026"
        });
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

// 6. रिडक्शन फंक्शन (Single Digit)
function calculateReduction(num) {
    let sum = num.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
}

// 7. प्रीमियम लॉकिंग और डिटेल व्यू
window.openDetail = function(type, isPaid) {
    let body = document.getElementById('modalBody');
    if (isPaid) {
        body.innerHTML = `
            <h2 class="gold-text">प्रीमियम रिपोर्ट लॉक 🔒</h2>
            <div style="text-align:center; padding:20px; border:1px dashed var(--gold); border-radius:15px; margin-top:15px;">
                <p>2026 का विस्तृत विश्लेषण और महा-उपाय केवल प्रीमियम वर्जन में उपलब्ध हैं।</p>
                <h2 style="color:var(--gold); font-size:2rem; margin:15px 0;">₹199</h2>
                <button class="btn-main" onclick="window.open('upi://pay?pa=YOUR_UPI@okicici&pn=Ankdristi&am=199&cu=INR')">UPI से अभी अनलॉक करें</button>
                <p style="font-size:0.7rem; margin-top:10px; color:#94a3b8;">सुरक्षित भुगतान द्वारा: Ankdristi</p>
            </div>
        `;
    } else {
        if(type === 'mulank') body.innerHTML = `<h2 class="gold-text">मूलांक: ${user.mulank}</h2><p>यह अंक आपके स्वभाव और व्यक्तित्व की नींव है।</p>`;
        if(type === 'bhagyank') body.innerHTML = `<h2 class="gold-text">भाग्यांक: ${user.bhagyank}</h2><p>यह आपके जीवन का मुख्य मार्ग और डेस्टिनी दर्शाता है।</p>`;
        if(type === 'namank') body.innerHTML = `<h2 class="gold-text">नामांक: ${user.namank}</h2><p>आपका नाम समाज में आपकी सफलता और ऊर्जा तय करता है।</p>`;
        if(type === 'missing') {
            const missing = getMissing(user.dob);
            body.innerHTML = `<h2 class="gold-text">लुप्त संख्या (Missing)</h2><p>आपकी जन्मतिथि में गायब अंकों के सरल उपाय:</p>${getRemedy(missing)}`;
        }
    }
    document.getElementById('detailModal').style.display = 'block';
};

function getMissing(dob) {
    const digits = dob.replace(/-/g, '').split('');
    return [1,2,3,4,5,6,7,8,9].filter(n => !digits.includes(n.toString()));
}

function getRemedy(arr) {
    const r = {1:"सूर्य को जल दें", 2:"चांदी पहनें", 3:"केसर तिलक", 4:"पक्षियों को दाना", 5:"गाय को हरा चारा", 6:"इत्र लगाएं", 7:"कुत्ता सेवा", 8:"दीप दान", 9:"हनुमान चालीसा"};
    let h = "<ul>";
    arr.forEach(n => h += `<li style="margin-bottom:8px;"><strong>अंक ${n}:</strong> ${r[n]}</li>`);
    return h + "</ul>";
}

window.closeModal = function() {
    document.getElementById('detailModal').style.display = 'none';
};
