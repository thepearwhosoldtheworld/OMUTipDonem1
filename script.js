
const kurullar = [
    { id: 'k1', akts: 4 },              // Tıbbi Bilimlere Giriş
    { id: 'k2', akts: 5 },              // Hücre Yapısı
    { id: 'k3', akts: 6 },              // Hücre Fonksiyonu
    { id: 'k4', akts: 3 },              // Seçmeli Kurul (3 AKTS)
    { id: 'k5', akts: 5 },              // Doku Biyolojisi
    { id: 'k6', akts: 6 },              // Hareket Sistemi
    { id: 'k7', akts: 5 },              // Dolaşım ve Solunum
    { id: 'k8', akts: 4 },              // Sindirim ve Metabolizma
    { id: 'k9', akts: 4 }               // Sinir ve Duyu
];

const TOPLAM_AKTS = kurullar.reduce((acc, curr) => acc + curr.akts, 0); // 42

function hesapla() {
    let agirlikliToplam = 0;
    let girilenAktsToplami = 0;
    let eksikVarMi = false;

    for (let k of kurullar) {
        const inputElem = document.getElementById(k.id);
        const val = parseFloat(inputElem.value);

        if (!isNaN(val) && val >= 0 && val <= 100) {
            agirlikliToplam += val * k.akts;
            girilenAktsToplami += k.akts;
        } else {
            eksikVarMi = true;
        }
    }

    if (girilenAktsToplami === 0) {
        alert("Lütfen en az bir kurul notu giriniz.");
        return;
    }

    const blokOrtalamasi = agirlikliToplam / girilenAktsToplami;

    const mduInput = document.getElementById('mdu');
    const pdoInput = document.getElementById('pdo');
    const mdu = mduInput ? (parseFloat(mduInput.value) || 100) : 100;
    const pdo = pdoInput ? (parseFloat(pdoInput.value) || 100) : 100;

    const resultBox = document.getElementById('result-area');
    const statusBanner = document.getElementById('status-banner');
    const blokOrtVal = document.getElementById('res-blok-ort');
    const gerekenFinalVal = document.getElementById('res-gereken-final');
    const yilSonuVal = document.getElementById('res-yil-sonu');
    const descExplainer = document.getElementById('res-explainer');

    if (resultBox) resultBox.classList.remove('hidden');
    
    if (blokOrtVal) blokOrtVal.innerText = blokOrtalamasi.toFixed(2);

    if (blokOrtalamasi >= 80.00) {
        const hamYilSonu = (blokOrtalamasi * 0.75) + (mdu * 0.10) + (pdo * 0.10);
        const muafiyetNotu = hamYilSonu * (100 / 95);

        if (muafiyetNotu >= 69.50) {
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

            descExplainer.innerHTML = `
                <strong>Yeni Yönetmelik Muafiyet Hesabı:</strong><br>
                [(Blok Ort. × 0.75) + (MDÜ × 0.10) + (PDÖ × 0.10)] × (100/95)<br>
                [(${blokOrtalamasi.toFixed(2)} × 0.75) + (${mdu} × 0.10) + (${pdo} × 0.10)] × 1.0526 = <strong>${muafiyetNotu.toFixed(2)}</strong> (Geçme şartı: 69.50)
            `;
            return;
        }
    }

    const mevcutKatki = (blokOrtalamasi * 0.55) + (mdu * 0.10) + (pdo * 0.10);
    const gecmekIcinGereken = (69.50 - mevcutKatki) / 0.25;

    let hedefFinal = Math.max(49.50, gecmekIcinGereken);

    if (hedefFinal > 100) {
        statusBanner.className = 'status-banner banner-danger';
        statusBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-triangle-exclamation text-red"></i></div>
            <div>
                <h3 class="text-red">Bütünleme İhtimali Yüksek</h3>
                <p>Mevcut blok ortalaması ile finalde 100 alınsa dahi 69.50 geçme barajına ulaşılamıyor.</p>
            </div>
        `;
        gerekenFinalVal.innerText = "İmkansız (>100)";
        gerekenFinalVal.className = "metric-value text-red";
        yilSonuVal.innerText = "--";
    } else {
        statusBanner.className = 'status-banner banner-info';
        statusBanner.innerHTML = `
            <div class="banner-icon"><i class="fa-solid fa-circle-info text-blue"></i></div>
            <div>
                <h3 class="text-blue">Final Sınavına Girmeniz Gerekiyor</h3>
                <p>Blok ortalamanız 80.00 altında kaldığı için muafiyet kazanamadınız.</p>
            </div>
        `;
        gerekenFinalVal.innerText = hedefFinal.toFixed(1);
        gerekenFinalVal.className = "metric-value text-blue";
        
        const ornekYilSonu = mevcutKatki + (hedefFinal * 0.25);
        yilSonuVal.innerText = ornekYilSonu.toFixed(2);
    }

    descExplainer.innerHTML = `
        <strong>Standart Yıl Sonu Formülü:</strong><br>
        (Blok Ort. × 0.55) + (Final × 0.25) + (MDÜ × 0.10) + (PDÖ × 0.10) ≥ 69.50<br>
        <em>*Final sınav barajı en az 49.50 puandır. Blok ortalaması 80.00 ve üzerine ulaştığında sistem otomatik muafiyete geçer.</em>
    `;
}

function sifirla() {
    kurullar.forEach(k => {
        const inp = document.getElementById(k.id);
        if (inp) inp.value = '';
    });
    const resultBox = document.getElementById('result-area');
    if (resultBox) resultBox.classList.add('hidden');
}
