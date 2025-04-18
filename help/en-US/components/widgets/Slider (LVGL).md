# DESCRIPTION

This Widget allows us to select one or two values from the list by moving the knob on the slider.

[More info](https://docs.lvgl.io/8.3/widgets/core/slider.html)

# PROPERTIES

## Min

The minimum value that can be selected.

## Min type

Select between `Literal` and `Expression`. If `Expression` is selected then `Min` can be evaluated from the expression.

## Max

The maximum value that can be selected.

## Max type

Select between `Literal` and `Expression`. If `Expression` is selected then `Max` can be evaluated from the expression.

## Mode

Slider mode options:

-   `NORMAL` – A normal slider.
-   `SYMMETRICAL` – Draw the indicator form the zero value to current value. Requires negative minimum range and positive maximum range.
-   `RANGE` – Allows setting the start value (`Value left` property) and end value (`Value` property).

## Value left

If `RANGE` mode is selected then this is selected start value on the slider.

## Value left type

Select between `Literal` and `Assignable`. If `Assignable` is selected then `Value left` can be variable in which the selected start value will be stored.

## Preview value left

This is optional property. If specified then the left value (if `RANGE` mode is selected) of the Slider in the project editor will be this value.

## Value

The selected value on the slider. If `RANGE` mode is selected then this is selected end value on the slider.

## Value type

Select between `Literal` and `Assignable`. If `Assignable` is selected then `Value` can be variable in which the selected value will be stored.

## Preview value

This is optional property. If specified then the value of the Slider in the project editor will be this value.

## Enable animation

If enabled then value change will be animated. Duration of animation is controlled with the style property ("Miscellaneous" section) "Anim time" in LVGL 8.4 or "Anim duration" in LVGL 9.1.

# INPUTS [EMPTY]

# OUTPUTS [EMPTY]

# EXAMPLES

-   _Dashboard Widgets Demo_
