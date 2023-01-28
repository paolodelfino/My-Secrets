$.fn.accordion = function () {
  $("[accordion]").each(function () {
    const $parent = $(this);

    // take the toggle button
    const $toggle = $parent.find("div").first();

    // add the click event
    $toggle.click(function () {
      const $this = $(this);

      // get parent of the parent of the clicked element
      const $container = $parent.parent().parent();

      // get all accordions in the parent
      const $accordions = $container.find("[accordion]");

      // close all accordions
      $accordions.each(function () {
        // if the accordion is not the clicked one
        if (!$(this).is($this.parent())) {
          // close it
          $(this).find("div").eq(1).removeAttr("display");
          $(this).find("div").first().removeAttr("focus");
        }
      });

      // so then, you can toggle the clicked one
      if (
        $this.parent().find("div").eq(1).attr("display") !== undefined &&
        $this.parent().find("div").first().attr("focus") !== undefined
      ) {
        $this.parent().find("div").eq(1).removeAttr("display");
        $this.parent().find("div").first().removeAttr("focus");
      } else {
        $this.parent().find("div").eq(1).attr("display", "");
        $this.parent().find("div").first().attr("focus", "");
      }
    });
  });
};
