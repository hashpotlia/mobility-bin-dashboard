// ==UserScript==
// @name         Mobility BIN Dashboard Ultra PRO
// @namespace    https://github.com/hashpotlia/mobility-bin-dashboard
// @version      1.4.0
// @description  Real-time BIN Weight + Count dashboard for Mobility!
// @author       @hpotlia
// @match        https://mobility.amazon.com/
// @updateURL    https://github.com/hashpotlia/mobility-bin-dashboard/raw/refs/heads/main/bin-dashboard.user.js
// @downloadURL  https://github.com/hashpotlia/mobility-bin-dashboard/raw/refs/heads/main/bin-dashboard.user.js
// @grant        none
// ==/UserScript==

// part count, weight mapping, export, sorting, and all recent additions.)
(function() {
  'use strict';

  const maxConcurrentFetches = 5;
  let activeFetches = 0;
  let queue = [];

  const deviceWeights = {
      // Big thanks and shoutout to [https://tiny.amazon.com/aickgbkp] for list...
      // More device/product are coming...apart form this list...
  "SRX5800E-BASE-AC": 181.44,
  "SRX5800-CHAS": 181.44,
  "SRX5800X-CHAS-BB": 181.44,
  "MX480BASE3-AC": 81.65,
  "CHAS-BP-MX480-S": 81.65,
  "CHAS-BP3-MX480-S": 81.65,
  "MX240BASE3-ACH": 58.06,
  "CHAS-BP-MX240-S": 58.06,
  "CHAS-BP3-MX240-S": 58.06,
  "MX240BASE3-AC-HIGH": 58.06,
  "SSRX-5400BB-ACX5400": 58.06,
  "SRX5400-CHAS": 58.06,
  "MX10003-BASE": 54.43,
  "124-031072-": 31.3,
  "PTX1000-72Q-CHAS-S": 31.3,
  "PTX1K-72Q-AC-IR": 31.3,
  "PTX1000-72Q-AC": 31.3,
  "PTX1000-72Q-CHAS-S-J": 31.3,
  "PTX1K-72Q-AC-IR-BFB": 31.3,
  "PTX1000-72Q-CHAS-S-F": 31.3,
  "PTX1000-72Q-CHAS-S-H": 31.3,
  "PTX1000-72Q-CHAS-S-G": 31.3,
  "PTX1000-72Q-CHAS-S-A": 31.3,
  "QFX10002-72Q-CHAS": 31.12,
  "QFX10002-72Q": 31.12,
  "8500105": 27.2,
  "14041-40G": 27.2,
  "MPX14041-40G": 27.2,
  "MPX14000": 27.2,
  "14041T": 27.2,
  "124-001598": 27.2,
  "AS8060-32X-DC-11 (R03)": 17.5,
  "AS8060-32X-DC-11": 17.5,
  "AS8060-32X-DC-11 (R02)": 17.5,
  "AS8060-32X-DC-11 (R01)": 17.5,
  "AS8060-32X-DC-11(R02)": 17.5,
  "CS8260-32X-DC-11": 16.2,
  "CS8260-32X-DC-11 (R02)": 16.2,
  "CS8260-32X-DC-11 (R01)": 16.2,
  "124-002865": 16.2,
  "CS8200-32X-DC-11 (R02)": 16,
  "CS8200-32X-DC-11": 16,
  "R1276-F0002-01": 16,
  "124-001856": 16,
  "CS8200-32X-DC11": 16,
  "CS8000-32X-DC-11 (R04)": 15.7,
  "CS8000-32X-DC-11": 15.7,
  "R1165-F0002-02": 15.7,
  "124-001855": 15.7,
  "R1165-F0002-01": 15.7,
  "cs8000-32x-dc-11 (r03)": 15.7,
  "CS8000-32X-UN-00": 14.6,
  "CS8000-32X-UN-00 (R04)": 14.6,
  "R1165-F0001-01": 14.6,
  "QFX5100-24Q-AFO": 14.52,
  "QFX5100-96S-AFO": 14.52,
  "QFX5100-48S-3AFO": 9.9,
  "QFX5100-48S-AFO": 9.9,
  "QFX5100-24Q-3AFO": 9.9,
  "QFX5100-48T-AFO": 9.9,
  "7762-32X-A-AC-F-HVDC": 13.4,
  "7762-32X-A-AC-F": 13.4,
  "AS7762-32X-HVDC": 13.4,
  "7762-32X-A-AC-F-D-HVDC": 13.4,
  "AS7762-32X-HVDC (R01)": 13.4,
  "AS7762-32X-12V": 13.4,
  "AS7762-32X": 13.4,
  "AS7762-32X-12V (R01)": 13.4,
  "7762-32X-A-12V-F-21-D": 13.4,
  "AS7762-32X-HCC-HVDC": 13.4,
  "AS7762-32X-12V (R02)": 13.4,
  "7762-32X-A-12V-F-D-21": 13.4,
  "AS7762-32X-A-AC-F": 13.4,
  "AS7762-32X-A-AC-F-HVDC": 13.4,
  "N9K-C9336C-FX2": 12.7,
  "C9500-48Y4C-A": 11.5,
  "7772-32X-A-AC-F": 10.9,
  "7772-32X-A-AC-F-G-HVDC": 10.9,
  "7772-32X-A-AC-F-I-HVDC": 10.9,
  "AS7772-32X": 10.9,
  "AS7772-32X-HVDC (R02)": 10.9,
  "7772-32X-A-AC-F-D": 10.9,
  "AS7772-32X-HVDC": 10.9,
  "AS7772-32X-12V": 10.9,
  "7772-32X-A-AC-F-G": 10.9,
  "7772-32X-A-AC-F-E": 10.9,
  "7772-32X-A-12V-F-21": 10.9,
  "AS7772-32X-12V (R01)": 10.9,
  "7772-32X-A-12V-F-I-21": 10.9,
  "AS7772-HVDC": 10.9,
  "AS7772-32X-HCC-HVDC": 10.9,
  "AS7772-32X-HVDCREV.2": 10.9,
  "QFX5200-32C-AFO": 10.89,
  "QFX5200-32C-AFO2": 10.89,
  "7710-32X-A-AC-F": 10,
  "T3048": 10,
  "7712-32X-O-AC-F-US": 9.98,
  "AS7712-32X": 9.98,
  "7762-32X-A-AC-F-HVDC": 9.6,
  "7762-32X-A-AC-F": 9.6,
  "AS7762-32X-HVDC": 9.6,
  "7762-32X-A-AC-F-D-HVDC": 9.6,
  "AS7762-32X-HVDC (R01)": 9.6,
  "AS7762-32X-12V": 9.6,
  "AS7762-32X": 9.6,
  "AS7762-32X-12V (R01)": 9.6,
  "7762-32X-A-12V-F-21-D": 9.6,
  "AS7762-32X-HCC-HVDC": 9.6,
  "AS7762-32X-12V (R02)": 9.6,
  "7762-32X-A-12V-F-D-21": 9.6,
  "AS7762-32X-A-AC-F": 9.6,
  "AS7762-32X-A-AC-F-HVDC": 9.6,
  "L7048N": 8.8,
  "L7048N-R": 8.8,
  "ISR4331/K9": 8.39,
  "EX4300-48P": 8.39,
  "EX4300-48T": 8.39,
  "EX4300-24P": 8.39,
  "JPSU-715-AC-AFO": 8.39,
  "EX4300-32F": 8.39,
  "EX 4300-48T": 8.39,
  "EX-UM-4X4SFP": 8.39,
  "EX4300-24T": 8.39,
  "SRX1500-AC": 7.3,
  "AS4610-54T-HVDC": 6.35,
  "AS4610-54P-AC": 6.35,
  "4610-54T-O-AC-F-US": 6.35,
  "AS4610-54T-AC": 6.35,
  "AS4610-54P": 6.35,
  "CISCO2901-K9": 6.08,
  "TN48M2": 5.7,
  "TN48M2V2": 5.7,
  "DMC-12-48R-AS0": 3.5,
  "DMC-12-48R-DN0": 3.5,
  "DMC-12-48C-AS0": 3.5,
  "DMC-12-48C-DN0": 3.5,
  "AS3510-48T-HVDC": 2.9,
  "3510-48T-A-AC-F": 2.9,
  "AS3510-48T": 2.9,
  "AS3510-48T-12V": 2.9,
  "3510-48T-A-12V-F": 2.9,
  "3510-48T-12V-F": 2.9,
  "3027-1017-000": 2.9,
  "AS3510-48T-HVDC": 2.7,
  "AS3510-48T": 2.7,
  "AS3510-48T-12V": 2.7,
  "RK-FLEX-24": 0.98
  };

  function injectButton() {
    const btn = document.createElement('button');
    btn.innerText = 'BIN Dashboard 🚀';
    btn.style.position = 'fixed';
    btn.style.top = '90px';
    btn.style.right = '30px';
    btn.style.padding = '10px 15px';
    btn.style.backgroundColor = '#0066cc';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.zIndex = 10000;
    btn.style.fontSize = '14px';
    btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    btn.addEventListener('click', openDashboard);
    document.body.appendChild(btn);
  }

  function openDashboard() {
    if (document.getElementById('mobility-dashboard')) return;

    const overlay = document.createElement('div');
    overlay.id = 'mobility-dashboard';
    overlay.style.position = 'fixed';
    overlay.style.top = '70px';
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';
    overlay.style.width = '950px';
    overlay.style.maxHeight = '80vh';
    overlay.style.backgroundColor = '#f2f2f2';
    overlay.style.color = '#222';
    overlay.style.border = '1px solid #ccc';
    overlay.style.borderRadius = '8px';
    overlay.style.padding = '15px';
    overlay.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    overlay.style.zIndex = 10001;
    overlay.style.overflowY = 'auto';
    overlay.innerHTML = `
      <h2 style="display:flex;justify-content:space-between;align-items:center;margin-top:0;">
        BIN Dashboard Ultra PRO
        <button id="close-dashboard" style="background:red;color:white;border:none;padding:5px 10px;border-radius:5px;font-size:14px;cursor:pointer;">X</button>
      </h2>
      <div style="margin-bottom:10px;">
        <input id="search-bin" type="text" placeholder="Enter BIN search keyword..." style="width:40%;padding:8px;border:1px solid #ccc;border-radius:5px;margin-right:8px;">
        <button id="search-button" style="padding:8px 12px;background:#0073e6;color:white;border:none;border-radius:5px;">Search</button>
        <button id="refresh-button" style="padding:8px 12px;background:#555;color:white;border:none;border-radius:5px;margin-left:8px;">Re-Count</button>
        <button id="export-button" style="padding:8px 12px;background:#28a745;color:white;border:none;border-radius:5px;margin-left:8px;">Export CSV</button>
        <button id="sort-button" style="padding:8px 12px;background:#6c757d;color:white;border:none;border-radius:5px;margin-left:8px;">Sort Bins</button>
      </div>
      <style>
      .example {
                width: 890px;
                height: 80px;
                border: 1px solid black;
                padding: 10px;
                margin: 10px;
               }
      </style>
      <div class="example">
      <h4>How to Use Search:</h4>
       <ul>
          <li>Search all Bins by Site and Room: Format — SITE.ROOM <b>(e.g., AKL60.PARTS)</b></li>
          <li>Search a Specific Bin by Bin ID and Site/Cluster: Format — BIN ID && SITE/CLUSTER <b>(e.g., P105C1 && AKL or P105C1 && AKL60)</b></li>
       </ul>
      </div>
      <table style="width:100%;border-collapse:collapse;text-align:center;">
        <thead>
          <tr style="background-color:#ddd;">
            <th style="padding:6px;border:1px solid #ccc;">Bin ID</th>
            <th style="padding:6px;border:1px solid #ccc;">Bin</th>
            <th style="padding:6px;border:1px solid #ccc;">Bin Tag</th>
            <th style="padding:6px;border:1px solid #ccc;">#COUNT</th>
            <th style="padding:6px;border:1px solid #ccc;">Open</th>
            <th style="padding:6px;border:1px solid #ccc;">Device Weight (kg)</th>
            <th style="padding:6px;border:1px solid #ccc;">Total Bin Weight (kg)</th>
          </tr>
        </thead>
        <tbody id="dashboard-results"></tbody>
      </table>
    `;
    document.body.appendChild(overlay);

    document.getElementById('close-dashboard').addEventListener('click', () => overlay.remove());
    document.getElementById('search-button').addEventListener('click', searchBins);
    document.getElementById('refresh-button').addEventListener('click', refreshCounts);
    document.getElementById('export-button').addEventListener('click', exportCSV);
    document.getElementById('sort-button').addEventListener('click', sortBins);
  }

  function searchBins() {
    const keyword = document.getElementById('search-bin').value.trim();
    const results = document.getElementById('dashboard-results');
    results.innerHTML = '';
    queue = [];
    activeFetches = 0;

    if (!keyword) {
      results.innerHTML = '<tr><td colspan="7">No search keyword entered.</td></tr>';
      return;
    }

    const url = `https://mobility.amazon.com/part/bin?search_type=all&search_string=${encodeURIComponent(keyword)}&max_rows=10000&query=GO`;
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('table tbody tr');

        if (rows.length === 0) {
          results.innerHTML = '<tr><td colspan="7">No bins found.</td></tr>';
          return;
        }

        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 7) return;

          const id = cells[0].textContent.trim();
          const bin = cells[1].textContent.trim();
          const binTag = cells[6].textContent.trim();

          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td style="padding:6px;border:1px solid #ccc;text-align:center;">${id}</td>
            <td style="padding:6px;border:1px solid #ccc;text-align:center;">${bin}</td>
            <td style="padding:6px;border:1px solid #ccc;text-align:center;">${binTag}</td>
            <td style="padding:6px;border:1px solid #ccc;text-align:center;" class="count-cell"><div class="spinner"></div></td>
            <td style="padding:6px;border:1px solid #ccc;text-align:center;"><a href="https://mobility.amazon.com/part/bin/${id}" target="_blank">Open</a></td>
            <td style="padding:6px;border:1px solid #ccc;text-align:center;" class="device-weight-cell"></td>
            <td style="padding:6px;border:1px solid #ccc;text-align:center;" class="bin-weight-cell"></td>
          `;
          results.appendChild(tr);

          queue.push({ id, countCell: tr.querySelector('.count-cell'), deviceWeightCell: tr.querySelector('.device-weight-cell'), binWeightCell: tr.querySelector('.bin-weight-cell') });
        });

        processQueue();
      })
      .catch(error => {
        console.error('BIN search error:', error);
        results.innerHTML = '<tr><td colspan="7">Failed to load bins.</td></tr>';
      });
  }

  function refreshCounts() {
    const results = document.getElementById('dashboard-results');
    const rows = results.querySelectorAll('tr');
    queue = [];
    activeFetches = 0;

    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length >= 7) {
        const id = cells[0].textContent.trim();
        const countCell = cells[3];
        const deviceWeightCell = cells[5];
        const binWeightCell = cells[6];
        countCell.innerHTML = '<div class="spinner"></div>';
        deviceWeightCell.innerHTML = '';
        binWeightCell.innerHTML = '';
        queue.push({ id, countCell, deviceWeightCell, binWeightCell });
      }
    });

    processQueue();
  }

  function processQueue() {
    while (activeFetches < maxConcurrentFetches && queue.length > 0) {
      const task = queue.shift();
      fetchPartsAndWeights(task.id, task.countCell, task.deviceWeightCell, task.binWeightCell);
    }
  }

  function fetchPartsAndWeights(binId, countCell, deviceWeightCell, binWeightCell) {
    activeFetches++;

    fetch(`https://mobility.amazon.com/part/bin/${binId}`)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const tables = [...doc.querySelectorAll('table')];

        let partCount = 0;
        let totalWeight = 0;

        for (const table of tables) {
          const headers = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim().toLowerCase());
          if (headers.slice(0,5).join(',') === "serial id,model,vendor,type,state") {
            const rows = table.querySelectorAll('tbody tr');
            partCount = rows.length;
            rows.forEach(row => {
              const cells = row.querySelectorAll('td');
              if (cells.length >= 2) {
                const model = cells[1].textContent.trim();
                const weight = deviceWeights[model];
                if (weight) {
                  totalWeight += weight;
                }
              }
            });
            break;
          }
        }

        countCell.innerHTML = `<b>${partCount}</b>`;
        deviceWeightCell.innerHTML = '-'; // (reserved)
        binWeightCell.innerHTML = `<b>${totalWeight.toFixed(2)} kg</b>`;
        activeFetches--;
        processQueue();
      })
      .catch(error => {
        console.error('Parts count error for BIN:', binId, error);
        countCell.innerHTML = '❌';
        binWeightCell.innerHTML = '❌';
        activeFetches--;
        processQueue();
      });
  }

  function exportCSV() {
    const rows = [...document.querySelectorAll('#dashboard-results tr')];
    const data = rows.map(row => {
      const cells = row.querySelectorAll('td');
      return [
        cells[0]?.textContent.trim(),
        cells[1]?.textContent.trim(),
        cells[2]?.textContent.trim(),
        cells[3]?.textContent.trim(),
        cells[6]?.textContent.trim()
      ].join(',');
    });

    const csvContent = `Bin ID,Bin,Bin Tag,Parts Count,Total Bin Weight\n${data.join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bin_dashboard_export_${new Date().toISOString().slice(0,16).replace(/[:-]/g,'').replace('T','_')}.csv`;
    link.click();
  }

  function sortBins() {
    const tbody = document.getElementById('dashboard-results');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    rows.sort((a, b) => {
      const aWeight = parseFloat(a.querySelector('.bin-weight-cell')?.textContent.replace('kg','').trim() || '0');
      const bWeight = parseFloat(b.querySelector('.bin-weight-cell')?.textContent.replace('kg','').trim() || '0');
      return bWeight - aWeight;
    });
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
  }

  window.addEventListener('load', () => {
    setTimeout(injectButton, 1500);
  });
})();
