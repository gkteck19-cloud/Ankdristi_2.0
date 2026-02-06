// 1. Firebase Imports (CDN Version)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Firebase Configuration (गौतम जी की सेटिंग्स)
const firebaseConfig = {
  apiKey: "AIzaSyCJIfQ-UTS6ns0pRO0nH4wzUQNnBB4_plc",
  authDomain: "ankdristi-37446610-e3f3b.firebaseapp.com",
  projectId: "ankdristi-37446610-e3f3b",
  storageBucket: "ankdristi-37446610-e3f3b.firebasestorage.app",
  messagingSenderId: "216216154216",
  appId: "1:216216154216:web:c6d5ffde5dc4faf13dcbdd"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 4. डेटा और सेटिंग्स
let selectedGender = "";
const charMap = { 
    A:1, I:1, J:1, Q:1, Y:1, 
    B:2, K:2, R:2, 
    C:3, G:3, L:3, S:3, 
    D:4, M:4, T:4, 
    E:5, H:5, N:5, X:5, 
    U:6, V:6, W:6, 
    O:7, Z:7, 
    P:8, F:8 
};

const remediesMap = {
    1: "सूर्य को जल दें और तांबे का कड़ा पहनें।",
    2: "चांदी का टुकड़ा पास रखें या सोमवार का व्रत करें।",
    3: "केसर का तिलक लगाएं और पीले रुमाल का प्रयोग करें।",
    4: "पक्षियों को बाजरा खिलाएं या लकड़ी की माला पहनें।",
    5: "गाय को हरा चारा खिलाएं और हरे रंग का प्रयोग करें।",
    6: "इत्र (Perfume) का प्रयोग करें और साफ कपड़े पहनें।",
    7: "कुत्तों को रोटी खिलाएं और गणेश जी की पूजा करें।",
    8: "पीपल के नीचे सरसों के तेल का दीपक जलाएं।",
    9: "हनुमान चालीसा का पाठ करें और मंगल को गुड़ दान करें।"
};

// 5. जेंडर सिलेक्शन फंक्शन
window.selectGender = function(g) {
    selectedGender = g;
    document.getElementById('maleBtn').classList.toggle('active', g === 'Male');
    document.getElementById('femaleBtn').classList.toggle('active', g === 'Female');
};

// 6. सिंगल डिजिट में बदलने का लॉजिक
function reduce(num) {
    let sum = num;
    while (sum > 9) {
        sum = sum.toString().split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    }
    return sum;
}

// 7. लाइव नामांक (Real-time calculation)
window.calculateLiveNamank = function(name) {
    let sum = 0;
    let clean = name.toUpperCase().replace(/[^A-Z]/g, '');
    for (let char of clean) {
        sum += charMap[char] || 0;
    }
    let single = reduce(sum);
    // UI पर 2-डिजिट और 1-डिजिट दोनों दिखाएगा
    document.getElementById('namankDisplay').innerText = sum > 0 ? `${sum} (${single})` : "0 (0)";
    return { total: sum, single: single };
};

// 8. परिणाम दिखाना और Firebase में डेटा सेव करना
window.showResults = async function() {
    const name = document.getElementById('userName').value;
    const dob = document.getElementById('userDOB').value;
    const mobile = document.getElementById('userMobile').value;

    if (!name || !dob || !selectedGender) {
        alert("कृपया नाम, जन्म तिथि और लिंग का चयन करें।");
        return;
    }

    const nObj = calculateLiveNamank(name);
    const day = parseInt(dob.split('-')[2]);
    const mulank = reduce(day);
    const fullDobSum = dob.replace(/-/g, '').split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const bhagyank = reduce(fullDobSum);

    // परिणाम डिस्प्ले करना
    document.getElementById('resMulank').innerText = mulank;
    document.getElementById('resBhagyank').innerText = bhagyank;
    document.getElementById('resNamank').innerText = `${nObj.total} (${nObj.single})`;
    
    let mobileSingle = 0;
    if(mobile) {
        const mobTotal = mobile.split('').reduce((a, b) => parseInt(a) + (parseInt(b) || 0), 0);
        mobileSingle = reduce(mobTotal);
        document.getElementById('resMobile').innerText = mobileSingle;
    }

    // Firebase में डेटा सुरक्षित करना
    try {
        await addDoc(collection(db, "user_queries"), {
            name: name,
            gender: selectedGender,
            dob: dob,
            mobile: mobile,
            mulank: mulank,
            bhagyank: bhagyank,
            namank: `${nObj.total}(${nObj.single})`,
            timestamp: new Date()
        });
    } catch (e) {
        console.error("Firebase Error: ", e);
    }

    // पेज बदलना
    document.getElementById('input-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
    window.scrollTo(0,0);
};

// 9. मिसिंग नंबर ढूंढने का फंक्शन
function getMissingNumbers() {
    const dob = document.getElementById('userDOB').value.replace(/-/g, '');
    const m = document.getElementById('resMulank').innerText;
    const b = document.getElementById('resBhagyank').innerText;
    const presentNumbers = (dob + m + b).split('');
    let missing = [];
    for (let i = 1; i <= 9; i++) {
        if (!presentNumbers.includes(i.toString())) missing.push(i);
    }
    return missing;
}

// 10. विश्लेषण विवरण (Pop-up)
window.openDetail = function(type) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    const missingArr = getMissingNumbers();

    let head = "", content = "";

    switch(type) {
        case 'missing':
            head = "लुप्त अंक (Missing Numbers)";
            content = "आपकी ग्रिड में अनुपस्थित अंक: <br><br>";
            if (missingArr.length === 0) {
                content += "<b style='color:#25D366;'>अदभुत! आपके पास सभी अंक मौजूद हैं।</b>";
            } else {
                missingArr.forEach(n => content += `<span class='missing-circle'>${n}</span>`);
                content += "<br><br>ये अंक जीवन के कुछ पहलुओं में चुनौतियों को दर्शाते हैं।";
            }
            break;
        case 'remedy':
            head = "सरल उपाय (Remedies)";
            content = "आपके मिसिंग अंकों के आधार पर उपाय: <br><br>";
            if (missingArr.length === 0) {
                content += "आपका चार्ट संतुलित है, नियमित योग और ध्यान जारी रखें।";
            } else {
                missingArr.forEach(n => content += `<b>अंक ${n}:</b> ${remediesMap[n]}<br><br>`);
            }
            break;
        default:
            head = "विश्लेषण";
            content = `यह आपके ${type} का संक्षिप्त विश्लेषण है। गहराई से जानकारी और समाधान के लिए प्रीमियम रिपोर्ट प्राप्त करें।`;
    }

    title.innerText = head;
    body.innerHTML = content;
    modal.classList.remove('hidden');
};

// 11. क्लोज और बैक नेविगेशन
window.closeModal = function() {
    document.getElementById('infoModal').classList.add('hidden');
};

window.goBack = function() {
    document.getElementById('result-page').classList.add('hidden');
    document.getElementById('input-page').classList.remove('hidden');
};

// 12. व्हाट्सएप सपोर्ट
window.contactPremium = function() {
    const msg = encodeURIComponent("नमस्ते गौतम जी, मुझे अंकदृष्टि प्रीमियम रिपोर्ट की जानकारी चाहिए।");
    window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`); // अपना नंबर डालें
};
    return sum;
}

// 7. लाइव नामांक कैलकुलेशन (टाइप करते समय)
window.calculateLiveNamank = function(name) {
    let sum = 0;
    let clean = name.toUpperCase().replace(/[^A-Z]/g, '');
    for (let char of clean) {
        sum += charMap[char] || 0;
    }
    let single = reduce(sum);
    document.getElementById('namankDisplay').innerText = sum > 0 ? `${sum} (${single})` : "0 (0)";
    return { total: sum, single: single };
};

// 8. परिणाम दिखाना और Firebase में सेव करना
window.showResults = async function() {
    const name = document.getElementById('userName').value;
    const dob = document.getElementById('userDOB').value;
    const mobile = document.getElementById('userMobile').value;

    if (!name || !dob || !selectedGender) {
        alert("कृपया नाम, जन्म तिथि और जेंडर चुनें।");
        return;
    }

    const nObj = calculateLiveNamank(name);
    const d = parseInt(dob.split('-')[2]);
    const mulank = reduce(d);
    const fullSum = dob.replace(/-/g, '').split('').reduce((a, b) => parseInt(a) + parseInt(b), 0);
    const bhagyank = reduce(fullSum);
    
    // UI अपडेट करें
    document.getElementById('resMulank').innerText = mulank;
    document.getElementById('resBhagyank').innerText = bhagyank;
    document.getElementById('resNamank').innerText = `${nObj.total} (${nObj.single})`;
    
    // मोबाइल योग
    let mobileTotal = 0;
    if(mobile) {
        mobileTotal = reduce(mobile.split('').reduce((a, b) => parseInt(a) + parseInt(b), 0));
        document.getElementById('resMobile').innerText = mobileTotal;
    }

    // Firebase में डेटा सेव करें
    try {
        await addDoc(collection(db, "user_queries"), {
            name: name,
            gender: selectedGender,
            dob: dob,
            mobile: mobile,
            mulank: mulank,
            bhagyank: bhagyank,
            namank: `${nObj.total}(${nObj.single})`,
            timestamp: new Date()
        });
    } catch (e) {
        console.error("Firebase Error: ", e);
    }

    // पेज बदलें
    document.getElementById('input-page').classList.add('hidden');
    document.getElementById('result-page').classList.remove('hidden');
    window.scrollTo(0,0);
};

// 9. विश्लेषण लिंक्स के लिए पॉप-अप खोलना
window.openDetail = function(type) {
    const modal = document.getElementById('infoModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    
    const dobDigits = document.getElementById('userDOB').value.replace(/-/g, '');
    const m = document.getElementById('resMulank').innerText;
    const b = document.getElementById('resBhagyank').innerText;
    const allPresent = dobDigits + m + b;
    
    let head = "", content = "";
    
    if(type === 'missing') {
        head = "लुप्त अंक (Missing Numbers)";
        let missing = [];
        for(let i=1; i<=9; i++) if(!allPresent.includes(i)) missing.push(i);
        content = missing.length ? missing.map(n => `<span class='missing-circle'>${n}</span>`).join(' ') : "अदभुत! आपके पास सभी अंक मौजूद हैं।";
    } else if(type === 'remedy') {
        head = "सरल उपाय";
        let missing = [];
        for(let i=1; i<=9; i++) if(!allPresent.includes(i)) missing.push(`<b>अंक ${i}:</b> ${remedies[i]}`);
        content = missing.length ? missing.join('<br><br>') : "नियमित गायत्री मंत्र का जाप करें।";
    } else {
        head = "अंक विश्लेषण";
        content = `यह आपके ${type} का संक्षिप्त विश्लेषण है। विस्तृत फलादेश और महा-उपायों के लिए नीचे दी गई प्रीमियम रिपोर्ट प्राप्त करें।`;
    }

    title.innerText = head;
    body.innerHTML = content;
    modal.classList.remove('hidden');
};

// 10. नेविगेशन और क्लोज फंक्शन
window.closeModal = function() {
    document.getElementById('infoModal').classList.add('hidden');
};

window.goBack = function() {
    document.getElementById('result-page').classList.add('hidden');
    document.getElementById('input-page').classList.remove('hidden');
};

window.contactPremium = function() {
    const msg = encodeURIComponent("नमस्ते गौतम जी, मुझे अंकदृष्टि प्रीमियम रिपोर्ट के बारे में जानकारी चाहिए।");
    window.open(`https://wa.me/91XXXXXXXXXX?text=${msg}`);
};
