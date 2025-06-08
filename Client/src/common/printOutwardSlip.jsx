export function printOutwardSlip(slip) {
  console.log("Printing Outward Slip:", slip);
  const printContent = `
        <html>
            <head>
                <title>Outward Slip</title>
                <style>
                    @media print {
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            margin: 0;
                            padding: 0;
                            background: #fff;
                        }
                        .slip-container {
                            padding: 30px;
                            max-width: 800px;
                            margin: auto;
                            border: 2px solid #000;
                            border-radius: 10px;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 30px;
                            padding-bottom: 10px;
                            border-bottom: 2px solid #000;
                        }
                        .header h2 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .details {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 20px;
                            margin-bottom: 30px;
                        }
                        .details p {
                            flex: 1 1 45%;
                            margin: 0;
                            font-size: 14px;
                            padding: 10px;
                            background: #f9f9f9;
                            border: 1px solid #ddd;
                            border-radius: 5px;
                        }
                        .items-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 30px;
                        }
                        .items-table th, .items-table td {
                            border: 1px solid #aaa;
                            padding: 8px 12px;
                            text-align: left;
                            font-size: 14px;
                        }
                        .items-table th {
                            background-color: #f0f0f0;
                        }
                        .signature-section {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 50px;
                        }
                        .signature-box {
                            flex: 0 0 45%;
                            text-align: center;
                        }
                        .signature-line {
                            margin-top: 60px;
                            border-top: 1px solid #000;
                            padding-top: 5px;
                            font-size: 12px;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 40px;
                            font-size: 12px;
                            border-top: 1px dashed #000;
                            padding-top: 10px;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="slip-container">
                    <div class="header">
                        <h2>Outward Slip</h2>
                    </div>
                    <div class="details">
                        <p><strong>Slip Number:</strong> ${slip.id}</p>
                        <p>
  <strong>Date:</strong> ${new Date(slip.createdAt)
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-")}
</p>

                        <p><strong>Worker:</strong> ${slip.workerName}</p>
                        <p><strong>Worker Type:</strong> ${slip.workerType}</p>
                        <p><strong>Status:</strong> ${slip.status}</p>
                    </div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${slip.items
                              .map(
                                (item) => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>${item.quantity}</td>
                                </tr>
                            `
                              )
                              .join("")}
                        </tbody>
                    </table>
       
                    <div class="footer">
                        <p>Generated on: ${new Date(
                          new Date().toLocaleString("en-US", {
                            timeZone: "Asia/Kolkata",
                          })
                        )
                          .toLocaleDateString("en-GB")
                          .split("/")
                          .join("-")}</p>
                    </div>
                </div>
            </body>
        </html>
    `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.onload = function () {
      printWindow.print();
      printWindow.onafterprint = function () {
        printWindow.close();
      };
    };
  } else {
    alert("Please allow popups for this site to print the outward slip.");
  }
}
