// OMÜ Tıp Dönem 1 - Standart Kurul Tanımları (Toplam 42 AKTS)
const kurullar = [
    { id: 'k_uyum', akts: 1, defaultVal: 100 }, // Uyum Haftası (Sabit 100)
    { id: 'k1', akts: 4 },                      // Hayatın Temeli
    { id: 'k2', akts: 5 },                      // Yaşam
    { id: 'k3', akts: 3 },                      // Seçmeli Kurul
    { id: 'k4', akts: 5 },                      // Beslenme
    { id: 'k5', akts: 5 },                      // Enerji
    { id: 'k6', akts: 5 },                      // Mikroçevrede Denge (MÇD)
    { id: 'k7', akts: 5 },                      // Üreme
    { id: 'k8', akts: 9 }                       // Destek ve Hareket
];

function hesapla() {
    let agirlikliToplam = 0;
    let girilenAktsToplami = 0;
    let kullaniciNotGirdiMi = false;

    // 1. Kurul notlarını topla
    for (let k of kurullar) {
        const inputElem = document.getElementById(k.id);
        let val = inputElem ? parseFloat(inputElem.value) : NaN;

        if (k.defaultVal !== undefined && isNaN(val)) {
            val = k.defaultVal;
        }

        if (!isNaN(val) && val >= 0 && val <= 100) {
            agirlikliToplam += val * k.akts;
            girilenAktsToplami += k.akts;

            if (k.id !== 'k_uyum') {
                kullaniciNotGirdiMi = true;
            }
        }
    }

    if (!kullaniciNotGirdiMi) {
        alert("Lütfen en az bir kurul sınav notu giriniz.");
        return;
    }

    // Blok Ortalaması
    const blokOrtalamasi = agirlikliToplam / girilenAktsToplami;

    // MDÜ ve PDÖ
    const mduInput = document.getElementById('mdu');
    const pdoInput = document.getElementById('pdo');
    const mdu = (mduInput && mduInput.value !== '') ? parseFloat(mduInput.value) : 100;
    const pdo = (pdoInput && pdoInput.value !== '') ? parseFloat(pdoInput.value) : 100;

    // Arayüz Alanları
    const resultBox = document.getElementById('result-area');
    const statusBanner = document.getElementById('status-banner');
    const blokOrtVal = document.getElementById('res-blok-ort');
    const gerekenFinalVal = document.getElementById('res-gereken-final');
    const yilSonuVal = document.getElementById('res-yil-sonu');
    const descExplainer = document.getElementById('res-explainer');

    if (resultBox) resultBox.classList.remove('hidden');
    if (blokOrtVal) blokOrtVal.innerText = blokOrtalamasi.toFixed(2);

    // ==========================================================
    // 1. DURUM: BLOK ORTALAMASI >= 80.00 (FİNALSİZ GEÇME)
    // Formül: [(Blok * 0.75) + (MDÜ * 0.10) + (PDÖ * 0.10)] * (100 / 95)
    // ==========================================================
    if (blokOrtalamasi >= 80.00) {
        const hamToplam = (blokOrtalamasi * 0.75) + (mdu * 0.10) + (pdo * 0.10);
        const muafiyetNotu = hamToplam * (100 / 95);

        statusBanner.className = 'status-banner banner-success';
        statusBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-circle-check text-green"></i></div>
            <div>
                <h3 class="text-green">Tebrikler, Finalden Muafsınız!</h3>
                <p>Blok ortalamanız 80.00 üzerinde olduğu için finale girmeden sınıfı doğrudan geçtiniz.</p>
            </div>
        `;

        gerekenFinalVal.innerText = "Gereksiz (Muaf)";
        gerekenFinalVal.className = "metric-value text-green";

        yilSonuVal.innerText = muafiyetNotu.toFixed(2);
        yilSonuVal.className = "metric-value text-green";

        descExplainer.innerHTML = `
            <strong>Finalsiz Geçme (Muafiyet) Hesabı:</strong><br>
            • Blok Katkısı (%75): <strong>${(blokOrtalamasi * 0.75).toFixed(2)}</strong><br>
            • MDÜ Katkısı (%10): <strong>${(mdu * 0.10).toFixed(2)}</strong><br>
            • PDÖ Katkısı (%10): <strong>${(pdo * 0.10).toFixed(2)}</strong><br>
            👉 <strong>Yıl Sonu Notunuz:</strong> [${hamToplam.toFixed(2)}] × (100/95) = <strong>${muafiyetNotu.toFixed(2)}</strong>
        `;
        return;
    }

    // ==========================================================
    // 2. DURUM: BLOK ORTALAMASI < 80.00 (FİNALE GİRENLER)
    // Formül: [(Blok * 0.50) + (Final * 0.25) + (MDÜ * 0.10) + (PDÖ * 0.10)] * (100 / 95)
    // ==========================================================
    const tabanBilesenler = (blokOrtalamasi * 0.50) + (mdu * 0.10) + (pdo * 0.10);

    // 69.50 için gereken final notu hesabı
    const gerekenHamToplam = 69.50 * 0.95; // 66.025
    const gerekenFinalHam = (gerekenHamToplam - tabanBilesenler) / 0.25;
    let gerekenFinal = Math.max(49.50, gerekenFinalHam);

    if (gerekenFinal > 100) {
        statusBanner.className = 'status-banner banner-danger';
        statusBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-triangle-exclamation text-red"></i></div>
            <div>
                <h3 class="text-red">Bütünleme İhtimali Yüksek</h3>
                <p>Mevcut blok ortalaması ile finalde 100 alınsa dahi 69.50 barajına ulaşılamıyor.</p>
            </div>
        `;
        gerekenFinalVal.innerText = "İmkansız (>100)";
        gerekenFinalVal.className = "metric-value text-red";
        yilSonuVal.innerText = "--";
        yilSonuVal.className = "metric-value text-red";
    } else {
        statusBanner.className = 'status-banner banner-info';
        statusBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-circle-info text-blue"></i></div>
            <div>
                <h3 class="text-blue">Final Sınavına Girmeniz Gerekiyor</h3>
                <p>Blok ortalamanız 80.00 altında olduğu için muafiyet kazanamadınız.</p>
            </div>
        `;
        gerekenFinalVal.innerText = gerekenFinal.toFixed(1);
        gerekenFinalVal.className = "metric-value text-blue";

        const ornekHam = tabanBilesenler + (gerekenFinal * 0.25);
        const ornekYilSonu = ornekHam * (100 / 95);
        yilSonuVal.innerText = ornekYilSonu.toFixed(2);
        yilSonuVal.className = "metric-value text-blue";
    }

    descExplainer.innerHTML = `
        <strong>Final ile Geçme Hesabı:</strong><br>
        Formül: [(Blok × 0.50) + (Final × 0.25) + (MDÜ × 0.10) + (PDÖ × 0.10)] × (100/95) ≥ 69.50<br>
        • Final barajı en az <strong>49.50</strong> puandır.
    `;
}

function sifirla() {
    kurullar.forEach(k => {
        const inp = document.getElementById(k.id);
        if (inp && k.id !== 'k_uyum') {
            inp.value = '';
        }
    });
    const resultBox = document.getElementById('result-area');
    if (resultBox) resultBox.classList.add('hidden');
}
