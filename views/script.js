function filterFunction1() {
  var radioTable, r_tr, r_td, r_i, r_txtvalue, filter, table, tr, td, i, txtValue;
  var all ="All";
  radioTable = document.getElementById("radioTable");
  r_tr = radioTable.getElementsByTagName("tr");
  //Get radiobutton textContent
  for (r_i = 0; r_i < r_tr.length; r_i++) {
    r_td = r_tr[r_i].getElementsByTagName("td")[0];
    r_txtValue = r_td.textContent.replace(/ /g,'');
    
   if (r_td) {
      if (document.getElementById(r_txtValue).checked) {
          filter = r_txtValue.toUpperCase().replace(/ /g,'');
          break;
      }
    }
  }
  //Remove unrelated items
  table = document.getElementById("itemTable");
  tr = table.getElementsByTagName("tr");
  //If the checked button is not "All"
  if (all.localeCompare(r_txtValue) != 0) {
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[5];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }       
    }
  }
  else {
    for (i = 0; i < tr.length; i++) {
      tr[i].style.display = "";
    }
  }
}

function filterFunction2() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchBar");
  filter = input.value.toUpperCase();
  table = document.getElementById("itemTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[5];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}