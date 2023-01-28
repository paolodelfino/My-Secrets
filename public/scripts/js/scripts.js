const store = new Store();

$(window).on("load", function () {
  refreshAccounts();
});

function refreshAccounts(sortBy = "modifyId") {
  $("#display").html("");
  $("body .flex.flex-row.w-full.justify-center.items-center.pt-5").remove();

  const accounts = store.get("accounts");

  if (!accounts) {
    $("body").append(`
            <div class="flex flex-row w-full justify-center items-center pt-5">
                <span class="text-gray-500">No accounts found</span>
            </div>
        `);
    return;
  }

  if (accounts.length >= 2) {
    switch (sortBy) {
      case "modifyId":
        accounts.sort((a, b) => b.modifyId - a.modifyId);
        break;
      case "id":
        accounts.sort((a, b) => b.id - a.id);
        break;
      case "service":
        accounts.sort((a, b) => a.service.localeCompare(b.service));
        break;
      case "email":
        accounts.sort((a, b) => a.email.localeCompare(b.email));
        break;
    }
  }

  accounts.forEach((account) => {
    const id = account.id;
    // id to month/day/year
    const date = new Date(id).toLocaleDateString();

    const modifiedId = account.modifyId;
    // modifiedId to month/day/year
    const lastModified = new Date(modifiedId).toLocaleDateString();

    const email = account.email;
    const service = account.service;

    $("#display").append(`
            <div class="credential" data-id="${id}" onclick="displayAccount(this)">
                <div>
                    <span>${date}</span>
                    <div>
                        ${service}
                    </div>
                </div>
                <div>
                    <span>${email}</span>
                </div>
                <div>
                    <span>Last modified on ${lastModified}</span>
                </div>
            </div>  
        `);
  });
}

function displayAccount(div) {
  store.set("temporaryQuestions", undefined);

  $("#display-service").val("");
  $("#display-email").val("");
  $("#display-password").val("");
  $("#questions-container").html("");
  $("#display-question").val("");
  $("#display-answer").val("");

  const id = $(div).attr("data-id");
  const account = store.get("accounts").find((account) => account.id == id);

  const service = account.service;
  const email = account.email;
  const password = account.password;
  const questions = account.questions;

  $("#display-account-modal").attr("data-id", id);
  $("#display-service").val(service);
  $("#display-email").val(email);
  $("#display-password").val(password);

  if (questions) {
    questions.forEach((question) => {
      $("#questions-container").append(`
        <div>
            <button onclick="removeQuestion(this)">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
                >
                    <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 12h-15"
                    />
                </svg>
            </button>
            <span>${question.question}</span>
            <span>${question.answer}</span>
        </div>
    `);
    });
  }

  $("#display-account-modal").click();
}

function removeQuestion(button) {
  const questionToRemove = $(button).next().text();

  const id = $("#display-account-modal").attr("data-id");
  const accounts = store.get("accounts");
  const account = accounts.find((account) => account.id == id);
  const questions = account.questions;

  const newQuestions = questions.filter(
    (question) => question.question != questionToRemove
  );

  account.questions = newQuestions;

  accounts.splice(accounts.indexOf(account), 1, account);

  store.set("accounts", accounts);

  $(button).parent().remove();
}

$("#download-button").click(function () {
  const accounts = store.get("accounts");
  const data = JSON.stringify(accounts);

  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.download = "accounts.json";
  a.href = "data:application/json," + encodeURIComponent(data);

  a.click();
  URL.revokeObjectURL(url);
  a.remove();
});

$("#import-button").click(function () {
  $("#files-input").click();
});

$("#files-input").change(function () {
  const file = this.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const accounts = JSON.parse(e.target.result);
    store.set("accounts", accounts);
    refreshAccounts("modifyId");
  };

  reader.readAsText(file);
});

$("#accounts-sort").change(function () {
  switch ($(this).val()) {
    case "by Modified Time":
      refreshAccounts("modifyId");
      break;
    case "by Creation Time":
      refreshAccounts("id");
      break;
    case "by Service":
      refreshAccounts("service");
      break;
    case "by Email":
      refreshAccounts("email");
      break;
  }
});

$("#search-query")
  .on("focus", function () {
    if ($(window).width() >= 768) {
      $("#search-bar-shortcut").hide();
    }
  })
  .on("blur", function () {
    if ($(window).width() >= 768) {
      if ($(this).val() == "") {
        $("#search-bar-shortcut").show();
      }
    }
  });

$("#search-query").focus();

document.getElementById("search-query").addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    const val = $(e.target).val();

    if (val && val.trim()) {
      search(val.trim());
    }
  }
});

function search(query) {
  const accounts = store.get("accounts");
  const filteredAccounts = accounts.filter((account) => {
    const service = account.service.toLowerCase();
    const email = account.email.toLowerCase();

    return service.includes(query) || email.includes(query);
  });

  $("#display").html("");

  filteredAccounts.forEach((account) => {
    const { id, service, email, modifyId } = account;

    const date = new Date(modifyId).toLocaleDateString();
    const lastModified = new Date(modifyId).toLocaleString();

    $("#display").append(`
            <div class="credential" data-id="${id}" onclick="displayAccount(this)">
                <div>
                    <span>${date}</span>
                    <div>
                        ${service}
                    </div>
                </div>
                <div>
                    <span>${email}</span>
                </div>
                <div>
                    <span>Last modified on ${lastModified}</span>
                </div>
            </div>  
        `);
  });
}

$.fn.dropdown();
$.fn.accordion();

$("#add-new").click(function () {
  // clean up the modal
  $("#add-new-modal input").val("");
  $("#add-new-modal textarea").val("");

  // clean up temporary informations
  store.set("temporaryQuestions", undefined);

  setTimeout(function () {
    if ($(window).width() >= 768) {
      $("#service").focus();
    }
  }, 500);
});

$("#add-new-modal .btn.btn-success").click(function () {
  const service = $("#service").val();
  const email = $("#email").val();
  const password = $("#password").val();

  const questions = store.get("temporaryQuestions");
  const id = new Date().getTime();
  const modifyId = new Date().getTime();

  if (!service || !email || !password) {
    return;
  }

  const accounts = store.get("accounts");

  if (!accounts) {
    store.set("accounts", [
      { service, email, password, questions, id, modifyId },
    ]);
  } else {
    accounts.push({ service, email, password, questions, id, modifyId });
    store.set("accounts", accounts);
  }
});

$("#display-account-modal-box .btn.btn-success").click(function () {
  const newQuestions = store.get("temporaryQuestions");
  const email = $("#display-email").val();
  const password = $("#display-password").val();
  const service = $("#display-service").val();

  const id = $("#display-account-modal").attr("data-id");
  const modifyId = new Date().getTime();

  if (!service || !email || !password) {
    return;
  }

  const accounts = store.get("accounts");
  const account = accounts.find((account) => account.id == id);

  let questions = account.questions;
  if (questions && newQuestions) {
    questions = questions.concat(newQuestions);
  } else if (newQuestions) {
    questions = newQuestions;
  }

  account.service = service;
  account.email = email;
  account.password = password;
  account.questions = questions;
  account.modifyId = modifyId;

  accounts.splice(accounts.indexOf(account), 1, account);

  store.set("accounts", accounts);
});

$("#refresh-list").click(function () {
  refreshAccounts();
});

// add shortcut on ctrl + p
document.onkeydown = function (e) {
  // shift + f
  if (e.shiftKey && e.keyCode == 70) {
    $("#search-query").focus();
  }

  // shift + n
  if (e.shiftKey && e.keyCode == 78) {
    $("#add-new").click();
  }

  // shift + r
  if (e.shiftKey && e.keyCode == 82) {
    $("#refresh-list").click();
  }
};

$("#add-question").click(function () {
  const question = $("#question").val();
  const answer = $("#answer").val();

  if (question == "" || answer == "") {
    return;
  }

  const questions = store.get("temporaryQuestions");

  if (!questions) {
    store.set("temporaryQuestions", [{ question, answer }]);
  } else {
    questions.push({ question, answer });
    store.set("temporaryQuestions", questions);
  }

  $("#question").val("");
  $("#answer").val("");

  $("#question").focus();
});

document.getElementById("service").onkeydown = function (e) {
  // if enter
  if (e.keyCode == 13) {
    $("#email").focus();
  }
};

document.getElementById("email").onkeydown = function (e) {
  // if enter
  if (e.keyCode == 13) {
    $("#password").focus();
  }
};

document.getElementById("password").onkeydown = function (e) {
  // if enter
  if (e.keyCode == 13) {
    $("#question").focus();
  }
};

document.getElementById("question").onkeydown = function (e) {
  // if enter
  if (e.keyCode == 13) {
    $("#answer").focus();
  }
};

document.getElementById("answer").onkeydown = function (e) {
  // if enter
  if (e.keyCode == 13) {
    $("#add-question").click();
  }
};

document.getElementById("display-question").onkeydown = function (e) {
  // if enter
  if (e.keyCode == 13) {
    $("#display-answer").focus();
  }
};

document.getElementById("display-answer").onkeydown = function (e) {
  // if enter
  if (e.keyCode == 13) {
    $("#display-add-question").click();
  }
};

$("#display-add-question").click(function () {
  const question = $("#display-question").val();
  const answer = $("#display-answer").val();

  if (question == "" || answer == "") {
    return;
  }

  const questions = store.get("temporaryQuestions");

  if (!questions) {
    store.set("temporaryQuestions", [{ question, answer }]);
  } else {
    questions.push({ question, answer });
    store.set("temporaryQuestions", questions);
  }

  $("#display-question").val("");
  $("#display-answer").val("");

  $("#display-question").focus();
});

document.getElementById("add-new-modal-box").onkeydown = function (e) {
  // if esc
  if (e.keyCode == 27) {
    $("#add-new-modal-box .btn.btn-error").click();
  }
};

document.getElementById("display-account-modal-box").onkeydown = function (e) {
  // if esc
  if (e.keyCode == 27) {
    $("#display-account-modal-box .btn.btn-error").click();
  }
};
