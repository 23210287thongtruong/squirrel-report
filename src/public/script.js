document.addEventListener("DOMContentLoaded", async () => {
  const apiUrl = "http://localhost:3000/api/salaries";
  const salaryCycleElement = document.getElementById("salary-cycle");
  const departmentElement = document.getElementById("department");
  const employeeSearchElement = document.getElementById("employee-search");
  const tableBody = document.querySelector("#salary-report tbody");
  const timestampElement = document.getElementById("timestamp");

  const salaryCycle = salaryCycleElement.value;
  const department = departmentElement.value;
  const employeeSearch = employeeSearchElement.value;

  const queryParams = new URLSearchParams({
    cycle: salaryCycle,
    department: department,
    search: employeeSearch,
  }).toString();

  const apiUrlWithParams = `${apiUrl}?${queryParams}`;

  updateTimestamp();

  try {
    const response = await fetch(apiUrlWithParams);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    handleData(data);
  } catch (error) {
    console.error("Error fetching salary data:", error);
  }

  function handleData(data) {
    populateFilters(data);
    populateTable(data);
    addEventListeners(data);
  }

  function populateFilters(data) {
    const cycles = [...new Set(data.map((record) => record.cycle))];
    const departments = [...new Set(data.map((record) => record.department))];

    salaryCycleElement.innerHTML = `<option value="">Tất cả Kỳ Lương</option>`;
    departmentElement.innerHTML = `<option value="">Tất cả Phòng Ban</option>`;

    cycles.forEach((cycle) => {
      const option = document.createElement("option");
      option.value = cycle;
      option.textContent = cycle;
      salaryCycleElement.appendChild(option);
    });

    departments.forEach((department) => {
      const option = document.createElement("option");
      option.value = department;
      option.textContent = department;
      departmentElement.appendChild(option);
    });
  }

  function populateTable(data) {
    tableBody.innerHTML = "";
    data.forEach((record) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${record.employeeId}</td>
                <td>${record.name}</td>
                <td>${record.department}</td>
                <td>${record.baseSalary.toLocaleString("vi-VN")} ₫</td>
                <td>${record.allowances.toLocaleString("vi-VN")} ₫</td>
                <td>${record.bonuses.toLocaleString("vi-VN")} ₫</td>
                <td>${record.netPay.toLocaleString("vi-VN")} ₫</td>
            `;
      tableBody.appendChild(row);
    });
  }

  function applyFilters(data) {
    const cycleFilter = salaryCycleElement.value;
    const departmentFilter = departmentElement.value;
    const searchFilter = employeeSearchElement.value.toLowerCase();

    const filteredData = data.filter((record) => {
      const matchesCycle = !cycleFilter || record.cycle === cycleFilter;
      const matchesDepartment =
        !departmentFilter || record.department === departmentFilter;
      const matchesSearch =
        !searchFilter ||
        record.name.toLowerCase().includes(searchFilter) ||
        record.employeeId.toLowerCase().includes(searchFilter);

      return matchesCycle && matchesDepartment && matchesSearch;
    });

    populateTable(filteredData);
  }

  function addEventListeners(data) {
    salaryCycleElement.addEventListener("change", () => applyFilters(data));
    departmentElement.addEventListener("change", () => applyFilters(data));
    employeeSearchElement.addEventListener("input", () => applyFilters(data));
  }

  function updateTimestamp() {
    const now = new Date();
    const formattedTimestamp = now.toLocaleString();
    timestampElement.textContent = formattedTimestamp;
  }
});
