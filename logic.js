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

// 4. मुख्य गणना (Calculation Logic)
window.calculateNumerology = async function() {
    const name = document.getElementById('userName').value;
    const dob = document.getElementById('userDOB').value;

    if (!name || !dob) {
        alert("कृपया अपना नाम और जन्म तिथि भरें।");
        return;
    }

    const btn = document.getElementById('calcBtn');
    btn.innerText = "गणना हो रही है...";
    btn.disabled = true;

    const [year, month, day] = dob.split('-');

    const mulank = calculateReduction(day);
    const bhagyank = calculateReduction(day + month + year);

    // परिणाम दिखाएं
    document.getElementById('mulank').innerText = mulank;
    document.getElementById('bhagyank').innerText = bhagyank;
    document.getElementById('results').classList.remove('hidden');

    // लोशू ग्रिड अपडेट करें
    fillGrid(day, month, year, mulank, bhagyank);

    // Firebase Firestore में डेटा सेव करें
    try {
        await addDoc(collection(db, "user_queries"), {
            name: name,
            dob: dob,
            mulank: mulank,
            bhagyank: bhagyank,
            timestamp: new Date()
        });
    } catch (e) {
        console.error("Firebase Error: ", e);
    }

    btn.innerText = "परिणाम देखें";
    btn.disabled = false;
};

function calculateReduction(numStr) {
    let sum = numStr.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
}

function fillGrid(d, m, y, mul, bhag) {
    // पहले पुराने नंबर मिटाएं
    for (let i = 1; i <= 9; i++) {
        const cell = document.getElementById('c' + i);
        if (cell) cell.innerText = '';
    }

    // जन्मतिथि और मूलांक-भाग्यांक के सभी अंकों को एक साथ जोड़ें
    const allDigits = (d + m + y + mul + bhag).split('');
    
    allDigits.forEach(digit => {
        if (digit !== '0') {
            const cell = document.getElementById('c' + digit);
            if (cell) {
                // अगर नंबर पहले से है, तो उसके आगे जोड़ें (जैसे 11)
                cell.innerText += digit;
            }
        }
    });
}

// WhatsApp पर शेयर करने का सिस्टम
window.shareApp = function() {
    const name = document.getElementById('userName').value;
    const m = document.getElementById('mulank').innerText;
    const b = document.getElementById('bhagyank').innerText;
    const text = `अंकदृष्टि (Ankdristi) परिणाम:\nनाम: ${name}\nमूलांक: ${m}\nभाग्यांक: ${b}\nअपना भाग्य देखें: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
};

// फ्लोटिंग विजेट (सपोर्ट)
window.contactSupport = function() {
    const msg = encodeURIComponent("नमस्ते गौतम जी, मुझे अंकदृष्टि के बारे में जानकारी चाहिए।");
    window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`, '_blank'); // यहाँ अपना नंबर डालें
};

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Ankdristi: Service Worker Registered'))
      .catch(err => console.log('Service Worker Error', err));
  });
}

// मिसिंग नंबर ढूंढने का फंक्शन
function getMissingNumbers(dob) {
    const dobDigits = dob.replace(/-/g, '').split('');
    const missing = [];
    for (let i = 1; i <= 9; i++) {
        if (!dobDigits.includes(i.toString())) {
            missing.push(i);
        }
    }
    return missing;
}

// मिसिंग नंबर के फ्री उपाय
function getFreeRemedies(missingArr) {
    const remedies = {
        1: "तांबे के लोटे से सूर्य को जल दें।",
        2: "पूर्णिमा का व्रत रखें या चांदी धारण करें।",
        3: "केसर का तिलक लगाएं और बड़ों का सम्मान करें।",
        4: "पक्षियों को बाजरा या अनाज खिलाएं।",
        5: "गाय को हरा चारा खिलाएं।",
        6: "इत्र (Perfume) का प्रयोग करें और साफ कपड़े पहनें।",
        7: "कुत्तों को रोटी खिलाएं।",
        8: "शनिवार को पीपल के नीचे सरसों के तेल का दीपक जलाएं।",
        9: "हनुमान चालीसा का पाठ करें।"
    };

    if (missingArr.length === 0) return "<p>अदभुत! आपके पास सभी अंक मौजूद हैं।</p>";

    let html = "<ul style='text-align:left; line-height:2;'>";
    missingArr.forEach(num => {
        html += `<li><strong>अंक ${num}:</strong> ${remedies[num]}</li>`;
    });
    html += "</ul>";
    return html;
}

// अपडेटेड openDetail फंक्शन
window.openDetail = function(type, isPaid) {
    let body = document.getElementById('modalBody');
    if (isPaid) {
        body.innerHTML = `
            <h2 class="gold-text">प्रीमियम लॉक 🔒</h2>
            <div class="pay-box">
                <p>गहराई से विश्लेषण और विशेष महा-उपाय केवल प्रीमियम रिपोर्ट में उपलब्ध हैं।</p>
                <h3 style="color:var(--gold); font-size:1.8rem;">मात्र ₹199</h3>
                <button class="btn-main" onclick="alert('UPI पेमेंट के लिए संपर्क करें: 91XXXXXXXXXX')">अनलॉक करें</button>
            </div>
        `;
    } else {
        if(type === 'mulank') {
            body.innerHTML = `<h2 class="gold-text">मूलांक: ${user.mulank}</h2><p>यह अंक आपके व्यक्तित्व की नींव है।</p>`;
        }
        if(type === 'bhagyank') {
            body.innerHTML = `<h2 class="gold-text">भाग्यांक: ${user.bhagyank}</h2><p>यह आपके जीवन का मुख्य उद्देश्य और मार्ग दर्शाता है।</p>`;
        }
        if(type === 'namank') {
            body.innerHTML = `<h2 class="gold-text">नामांक: ${user.namank}</h2><p>आपका नाम समाज में आपकी पहचान और सफलता तय करता है।</p>`;
        }
        if(type === 'missing') {
            const missing = getMissingNumbers(user.dob);
            body.innerHTML = `
                <h2 class="gold-text">लुप्त संख्या (Missing)</h2>
                <p>आपकी जन्मतिथि में गायब अंकों के सरल उपाय:</p>
                ${getFreeRemedies(missing)}
                <p style="font-size:0.8rem; color:var(--gold); margin-top:15px;">*विशेष महा-उपायों के लिए प्रीमियम रिपोर्ट देखें।</p>
            `;
        }
    }
    document.getElementById('detailModal').style.display = 'block';
};

