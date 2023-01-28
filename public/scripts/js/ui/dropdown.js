$.fn.dropdown = function () {
  $("[dropdown]").each(function () {
    const $parent = $(this);

    // take the toggle button
    const $toggle = $parent.find("button:first");

    // add the click event
    $toggle.click(function () {
      const $this = $(this);

      // get parent of the parent of the clicked element
      const $container = $parent.parent().parent();

      // get all dropdowns in the parent
      const $dropdowns = $container.find("[dropdown]");

      // close all dropdowns
      $dropdowns.each(function () {
        // if the dropdown is not the clicked one
        if (!$(this).is($this.parent())) {
          // close it
          $(this).find("div").first().removeAttr("display");
        }
      });

      // so then, you can toggle the clicked one
      if ($this.parent().find("div").first().attr("display") !== undefined) {
        $this.parent().find("div").first().removeAttr("display");
      } else {
        $this.parent().find("div").first().attr("display", "");
      }
    });
  });
};
