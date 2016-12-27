# selectoz
HTML select option with new mark up to be easy for styling.

# setup

## HTML:

To enable multiple selection when press on <kbd>ctrl</kbd> set ```data-multiple-select``` value to ```true```
``` html 
<!-- select container -->
<ul id='select' class='select cf' data-multiple-select='false'>
    <!-- to hold selected value -->
    <li class="select-input">
      <span class="selected-value"></span>
      <i class="input-icon fa fa-caret-down"></i>
    </li>
    
    <!-- container to group options -->
    <div>
        <!-- options -->
        <li class="option" data-value='' data-selected='true'>option1</li>
        <li class="option" data-value=''>option2</li>
        <li class="option" data-value=''>option3</li>
        ...
    </div>
</ul>
```

## Css
Then include default style at head tag

``` html 
<link href='csspath/selectoz-style.css' rel='stylesheet'>
```

## JavaScript
Now call the plugin function at the bottom of body
``` html
  <script src='jspath/selectoz-plugin.js'></script>
<!--</body>-->
```

# Example
## <a href='http://codepen.io/El-Oz/pen/oYrBBM'>codepen</a>
