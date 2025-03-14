const subjectName = document.getElementById("sub_name");
const classesTaken = document.getElementById("taken");
const sessionsHeld = document.getElementById("no_of_sessions");
const addDetails = document.getElementById("add_details");
const table = document.getElementById("table");
const tableBody = document.getElementById("table_body");
const generatePDFbtn = document.getElementById("generatepdf");
const { jsPDF } = window.jspdf;

let details = JSON.parse(localStorage.getItem("details")) || [];
let subjectsdetails = JSON.parse(localStorage.getItem("subjectsdetails")) || [];
let editIndex = -1;

function saveToLocalStorage() {
  localStorage.setItem("details", JSON.stringify(details));
  localStorage.setItem("subjectsdetails", JSON.stringify(subjectsdetails));
}

function loadFromLocalStorage() {
  if (details.length > 0) {
    displaySubjectDetails();
    showgeneratePDFbtn();
  }
}

function addSubjectDetails() {
  // Input validation
  if (!subjectName.value || !classesTaken.value || !sessionsHeld.value) {
    alert("Please enter all the details");
    return;
  }
  
  const taken = parseInt(classesTaken.value);
  const held = parseInt(sessionsHeld.value);
  
  if (taken > held) {
    alert("Classes taken cannot be greater than sessions held");
    return;
  }

  const moresessionsneeded = 3*held - 4*taken;

  const subjectdisplay = {
    subjectName: subjectName.value,
    classesTaken: taken,
    sessionsHeld: held,
  };

  const subject = {
    subjectName: subjectName.value,
    held: held,
    attended: taken,
    percentage: ((taken / held) * 100).toFixed(2),
    moresessionsneeded: moresessionsneeded > 0 ? moresessionsneeded : 0,
    updatedattended: taken + (moresessionsneeded > 0 ? moresessionsneeded : 0),
    updatedheld: held + (moresessionsneeded > 0 ? moresessionsneeded : 0),
  };

  if (editIndex === -1) {
    details.push(subjectdisplay);
    subjectsdetails.push(subject);
  } else {
    details[editIndex] = subjectdisplay;
    subjectsdetails[editIndex] = subject;
    editIndex = -1;
  }
  saveToLocalStorage();
  subjectName.value = "";
  classesTaken.value = "";
  sessionsHeld.value = "";
  displaySubjectDetails();
  showgeneratePDFbtn();
}

  function displaySubjectDetails() {
  tableBody.innerHTML = "";
  
  if (details.length > 0) {
    table.classList.remove("hidden");
    
    details.forEach((detail, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${detail.subjectName}</td>
        <td>${detail.classesTaken}</td>
        <td>${detail.sessionsHeld}</td>
        <td><button class="p-1 text-yellow-500 m-1" onclick="editSubject(${index})"><i class="ri-pencil-line"></i></button></td>
        <td><button class="p-1 text-red-500 m-1" onclick="deleteSubject(${index})"><i class="ri-delete-bin-line"></i></button></td>
      `;
      tableBody.appendChild(row);
    });
  }
}

function editSubject(index) {
  const detail = details[index];
  subjectName.value = detail.subjectName;
  classesTaken.value = detail.classesTaken;
  sessionsHeld.value = detail.sessionsHeld;
  addDetails.textContent = "Update Details";
  editIndex = index;
}


function deleteSubject(index) {
  details.splice(index, 1);
  subjectsdetails.splice(index, 1);
  saveToLocalStorage();
  displaySubjectDetails();
  showgeneratePDFbtn();
  if (details.length === 0) {
    table.classList.add("hidden");
  }
}

// Show/hide PDF button based on data
function showgeneratePDFbtn() {
  if (subjectsdetails.length > 0) {
    generatePDFbtn.classList.remove("hidden");
    generatePDFbtn.classList.add("block");
  } else {
    generatePDFbtn.classList.add("hidden");
  }
}

// Generate PDF report
function generatePDF() {
  const doc = new jsPDF();

  // Add title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AttendEase", 80, 15);
  
  // Add underline
  doc.setDrawColor(255, 0, 0);
  doc.line(75, 17, 125, 17);

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
    ]
  ];

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
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(
    "Note: You have to attend classes regularly to get the results.",
    75,
    pageHeight - 10
  );

  doc.save("Attendance_Summary.pdf");
}

addDetails.addEventListener("click", () => {
  addSubjectDetails();
  addDetails.textContent = "Add Details";
});
generatePDFbtn.addEventListener("click", generatePDF);

loadFromLocalStorage();