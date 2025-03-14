const subjectName = document.getElementById("sub_name");
const classesTaken = document.getElementById("taken");
const sessionsHeld = document.getElementById("no_of_sessions");
const addDetails = document.getElementById("add_details");
const table = document.getElementById("table");
const tableBody = document.getElementById("table_body");
const generatePDFbtn = document.getElementById("generatepdf");
const { jsPDF } = window.jspdf;

let details = [];
let subjectsdetails = [];

function addSubjectDetails() {
  if (
    subjectName.value === "" ||
    classesTaken.value === "" ||
    sessionsHeld.value === ""
  ) {
    alert("Please enter all the details");
    return;
  }
  const subjectdisplay = {
    subjectName: subjectName.value,
    classesTaken: parseInt(classesTaken.value),
    sessionsHeld: parseInt(sessionsHeld.value),
  };
  let moresessionsneeded =
    3 * parseInt(sessionsHeld.value) - 4 * parseInt(classesTaken.value);
  const subject = {
    subjectName: subjectName.value,
    held: parseInt(sessionsHeld.value),
    attended: parseInt(classesTaken.value),
    percentage: (
      (parseInt(classesTaken.value) / parseInt(sessionsHeld.value)) *
      100
    ).toFixed(2),
    moresessionsneeded: moresessionsneeded > 0? moresessionsneeded : 0,
    updatedattended: parseInt(classesTaken.value) + (moresessionsneeded > 0 ? moresessionsneeded : 0),
    updatedheld: parseInt(sessionsHeld.value) + (moresessionsneeded > 0 ? moresessionsneeded : 0),
  };
  details.push(subjectdisplay);
  subjectName.value = "";
  classesTaken.value = "";
  sessionsHeld.value = "";
  displaySubjectDetails();
  subjectsdetails.push(subject);
  console.log(subjectsdetails);
  showgeneratePDFbtn();
}

addDetails.addEventListener("click", addSubjectDetails);

function displaySubjectDetails() {
  if (details.length > 0) {
    table.classList.remove("hidden");
    table.classList.add("block");
    details.forEach((detail) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${detail.subjectName}</td>
            <td>${detail.classesTaken}</td>
            <td>${detail.sessionsHeld}</td>
            `;
      tableBody.appendChild(row);
    });
  }
  details = [];
}

function showgeneratePDFbtn() {
  if (subjectsdetails.length > 0) {
    generatePDFbtn.classList.remove("hidden");
    generatePDFbtn.classList.add("block");
  }
}
function generatePDF() {
  const doc = new jsPDF();
  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AttendEase", 80, 15);
  doc.setTextColor(0, 0, 0);

  // Draw red underline for title
  doc.setDrawColor(255, 0, 0);
  doc.line(75, 17, 125, 17);

  // Define table headers
  const headers = [
    [
      "S.No",
      "Subject Name",
      "Sessions Attended",
      "Sessions Held",
      "Current Percentage",
      "More Sessions Needed",
      "Updated Attended Sessions",
      "Updated Held Sessions",
    ],
  ];

  // Prepare table data
  const data = subjectsdetails.map((subject, index) => [
    `${index + 1}.`,
    subject.subjectName,
    subject.attended,
    subject.held,
    `${subject.percentage}%`,
    subject.moresessionsneeded,
    subject.updatedattended,
    subject.updatedheld,
  ]);

  // Generate table using autoTable
  doc.autoTable({
    head: headers,
    body: data,
    startY: 25,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      valign: "middle",
      halign: "center",
    },
    headStyles: {
      fillColor: [0, 0, 0], // Black header background
      textColor: [255, 255, 255], // White header text
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240], // Light gray alternating rows
    },
  });

  // Add footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Note: You have to attend classes regularly to get the results.", 75, pageHeight - 10);

  doc.save("Attendance_Summary.pdf");
}

generatePDFbtn.addEventListener("click", generatePDF);
