// OMÜ Tıp Dönem 1 - Kurul ve AKTS Dağılımı
// Toplam: 1 + 4 + 5 + 3 + 5 + 5 + 5 + 5 + 9 = 42 AKTS
const kurullar = [
    { id: 'k_uyum', akts: 1, defaultVal: 100 }, // Uyum Haftası (Sabit 100)
    { id: 'k1', akts: 4 },                      // 1. Blok: Hayatın Temeli
    { id: 'k2', akts: 5 },                      // 2. Blok: Yaşam
    { id: 'k3', akts: 3 },                      // 3. Blok: Seçmeli Kurul
    { id: 'k4', akts: 5 },                      // 4. Blok: Beslenme
    { id: 'k5', akts: 5 },                      // 5. Blok: Enerji
    { id: 'k6', akts: 5 },                      // 6. Blok: Mikroçevrede Denge (MÇD)
    { id: 'k7', akts: 5 },                      // 7. Blok: Üreme
    { id: 'k8', akts: 9 }                       // 8. Blok: Destek ve Hareket
];

function hesapla() {
    let agirlikliToplam = 0;
    let girilenAktsToplami = 0;
    let kullaniciNotGirdiMi = false;

    // 1. Kurul notlarını topla
    for (let k of kurullar) {
        const inputElem = document.getElementById(k.id);
        let val = inputElem ? parseFloat(inputElem.value) : NaN;

        // Uyum haftası için değer boşsa varsayılan 100 al
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

    // MDÜ ve PDÖ (Boş bırakılırsa 100 varsayılır)
    const mduInput = document.getElementById('mdu');
    const pdoInput = document.getElementById('pdo');
    const mdu = (mduInput && mduInput.value !== '') ? parseFloat(mduInput.value) : 100;
    const pdo = (pdoInput && pdoInput.value !== '') ? parseFloat(pdoInput.value) : 100;

    // Opsiyonel Final Notu Kutusu
    const finalInput = document.getElementById('final-input');
    const girilenFinal = (finalInput && finalInput.value !== '') ? parseFloat(finalInput.value) : null;

    // Arayüz Elementleri
    const resultBox = document.getElementById('result-area');
    const statusBanner = document.getElementById('status-banner');
    const blokOrtVal = document.getElementById('res-blok-ort');
    const gerekenFinalVal = document.getElementById('res-gereken-final');
    const yilSonuVal = document.getElementById('res-yil-sonu');
    const descExplainer = document.getElementById('res-explainer');

    if (resultBox) resultBox.classList.remove('hidden');
    if (blokOrtVal) blokOrtVal.innerText = blokOrtalamasi.toFixed(2);

    // ==========================================================
    // 1. DURUM: BLOK ORTALAMASI >= 80.00 (FİNALSİZ GEÇME / MUAFİYET)
    // Formül: [(Blok * 0.75) + (MDÜ * 0.10) + (PDÖ * 0.10)] * (100 / 95)
    // ==========================================================
    if (blokOrtalamasi >= 80.00) {
        const hamToplam = (blokOrtalamasi * 0.75) + (mdu * 0.10) + (pdo * 0.10);
        const muafiyetNotu = hamToplam * (100 / 95);

        statusBanner.className = 'status-banner banner-success';
        statusBanner.innerHTML = `
            <i class="fa-solid fa-circle-check text-green" style="font-size: 24px;"></i>
            <div>
                <h3 class="text-green">Tebrikler, Finalden Muafsınız!</h3>
                <p>Blok ortalamanız 80.00 üzerinde olduğu için finale girmeden doğrudan geçtiniz.</p>
            </div>
        `;

        gerekenFinalVal.innerText = "Muaf";
        gerekenFinalVal.className = "metric-value text-green";

        yilSonuVal.innerText = muafiyetNotu.toFixed(2);
        yilSonuVal.className = "metric-value text-green";

        descExplainer.innerHTML = `
            <strong>Finalsiz Geçme (Muafiyet) Hesabı:</strong><br>
            • Blok Katkısı (%75): <strong>${(blokOrtalamasi * 0.75).toFixed(2)}</strong><br>
            • MDÜ Katkısı (%10 - Not: ${mdu}): <strong>${(mdu * 0.10).toFixed(2)}</strong><br>
            • PDÖ Katkısı (%10 - Not: ${pdo}): <strong>${(pdo * 0.10).toFixed(2)}</strong><br>
            • Normalizasyon Çarpanı: <strong>100 / 95</strong><br>
             <strong>Yıl Sonu Başarı Notunuz:</strong> [${hamToplam.toFixed(2)}] × (100/95) = <strong>${muafiyetNotu.toFixed(2)}</strong>
        `;
        return;
    }

    // ==========================================================
    // 2. DURUM: BLOK ORTALAMASI < 80.00 (FİNALE GİRENLER)
    // Formül: [(Blok * 0.50) + (Final * 0.25) + (MDÜ * 0.10) + (PDÖ * 0.10)] * (100 / 95)
    // ==========================================================
    const tabanBilesenler = (blokOrtalamasi * 0.50) + (mdu * 0.10) + (pdo * 0.10);

    // SENARYO A: Kullanıcı Final Sınav Notunu Girdiyse
    if (girilenFinal !== null) {
        const hamYilSonu = tabanBilesenler + (girilenFinal * 0.25);
        const gercekYilSonu = hamYilSonu * (100 / 95);

        const barajGecti = girilenFinal >= 49.50;
        const ortalamaGecti = gercekYilSonu >= 69.50;

        if (barajGecti && ortalamaGecti) {
            statusBanner.className = 'status-banner banner-success';
            statusBanner.innerHTML = `
                <i class="fa-solid fa-circle-check text-green" style="font-size: 24px;"></i>
                <div>
                    <h3 class="text-green">Tebrikler, Sınıfı Geçtiniz!</h3>
                    <p>Girilen final notuyla 49.50 final barajını ve 69.50 yıl sonu barajını geçtiniz.</p>
                </div>
            `;
            gerekenFinalVal.innerText = girilenFinal.toFixed(1);
            gerekenFinalVal.className = "metric-value text-green";
            yilSonuVal.innerText = gercekYilSonu.toFixed(2);
            yilSonuVal.className = "metric-value text-green";
        } else {
            statusBanner.className = 'status-banner banner-danger';
            let hataSebebi = !barajGecti ? "Final notunuz 49.50 barajının altında kaldı." : "Yıl sonu ortalamanız 69.50 barajının altında kaldı.";
            statusBanner.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation text-red" style="font-size: 24px;"></i>
                <div>
                    <h3 class="text-red">Bütünlemeye Kaldınız</h3>
                    <p>${hataSebebi}</p>
                </div>
            `;
            gerekenFinalVal.innerText = girilenFinal.toFixed(1);
            gerekenFinalVal.className = "metric-value text-red";
            yilSonuVal.innerText = gercekYilSonu.toFixed(2);
            yilSonuVal.className = "metric-value text-red";
        }

        descExplainer.innerHTML = `
            <strong>Hesaplanan Yıl Sonu Notu Dökümü:</strong><br>
            • Blok Katkısı (%50): <strong>${(blokOrtalamasi * 0.50).toFixed(2)}</strong><br>
            • Final Katkısı (%25 - Not: ${girilenFinal}): <strong>${(girilenFinal * 0.25).toFixed(2)}</strong><br>
            • MDÜ Katkısı (%10 - Not: ${mdu}): <strong>${(mdu * 0.10).toFixed(2)}</strong><br>
            • PDÖ Katkısı (%10 - Not: ${pdo}): <strong>${(pdo * 0.10).toFixed(2)}</strong><br>
             <strong>Yıl Sonu Notunuz:</strong> [${hamYilSonu.toFixed(2)}] × (100/95) = <strong>${gercekYilSonu.toFixed(2)}</strong>
        `;
        return;
    }

    // SENARYO B: Final Notu Boş Bırakıldıysa (Gereken Final Hesabı)
    const gerekenHamToplam = 69.50 * 0.95; // 66.025
    const gerekenFinalHam = (gerekenHamToplam - tabanBilesenler) / 0.25;
    let gerekenFinal = Math.max(49.50, gerekenFinalHam);

    if (gerekenFinal > 100) {
        statusBanner.className = 'status-banner banner-danger';
        statusBanner.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation text-red" style="font-size: 24px;"></i>
            <div>
                <h3 class="text-red">Bütünleme İhtimali Yüksek</h3>
                <p>Mevcut blok ortalaması ile finalde 100 alınsa dahi 69.50 barajına ulaşılamıyor.</p>
            </div>
        `;
        gerekenFinalVal.innerText = "> 100";
        gerekenFinalVal.className = "metric-value text-red";
        yilSonuVal.innerText = "--";
        yilSonuVal.className = "metric-value text-red";
    } else {
        statusBanner.className = 'status-banner banner-info';
        statusBanner.innerHTML = `
            <i class="fa-solid fa-circle-info text-blue" style="font-size: 24px;"></i>
            <div>
                <h3 class="text-blue">Final Sınavına Girmeniz Gerekiyor</h3>
                <p>Blok ortalamanız 80.00 altında olduğu için muafiyet kazanamadınız.</p>
            </div>
        `;
        gerekenFinalVal.innerText = gerekenFinal.toFixed(1);
        gerekenFinalVal.className = "metric-value text-blue";

        const tahminiHam = tabanBilesenler + (gerekenFinal * 0.25);
        const tahminiYilSonu = tahminiHam * (100 / 95);
        yilSonuVal.innerText = tahminiYilSonu.toFixed(2);
        yilSonuVal.className = "metric-value text-blue";
    }

    descExplainer.innerHTML = `
        <strong>Final ile Geçme Hesabı:</strong><br>
        Formül: [(Blok × 0.50) + (Final × 0.25) + (MDÜ × 0.10) + (PDÖ × 0.10)] × (100/95) ≥ 69.50<br>
        • Final barajı en az <strong>49.50</strong> puandır.<br>
        • Final notunuz açıklandığında yukarıdaki kutucuğa yazarak kesinleşen ortalamanızı görebilirsiniz.
    `;
}

function sifirla() {
    kurullar.forEach(k => {
        const inp = document.getElementById(k.id);
        if (inp && k.id !== 'k_uyum') {
            inp.value = '';
        }
    });
    const finalInp = document.getElementById('final-input');
    if (finalInp) finalInp.value = '';
    const resultBox = document.getElementById('result-area');
    if (resultBox) resultBox.classList.add('hidden');
}
