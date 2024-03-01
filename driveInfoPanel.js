/*
    Made by Monnapse
*/

var cssAdded = false;
var addCssStyling;
if (!addCssStyling) {addCssStyling = style => document.head.appendChild(document.createElement("style")).innerHTML=style;}

const defaultStyling = `
/* DRIVE INFO */
.drive-info-container {
    top: 20px;
    width: 85%;
    color: var(--default-smoke);

    position: relative;
    left: 50%;
    -moz-transform: translateX(-50%); /* Firefox */
    -ms-transform: translateX(-50%);  /* IE 9 */
    -webkit-transform: translateX(-50%); /* Safari and Chrome*/
    -o-transform: translateX(-50%); /* Opera */
    transform: translateX(-50%);
}
.drive-info-text {
    font-size: 15px;
    color: var(--default-smoke);
}
.drive-info-progress-bar {
    width: 100%;
    height: 13px;
    background-color: var(--smoke-3);
    border-radius: 100px;

    display:flex;
    flex-wrap:wrap;
    flex-direction:row;
}
.drive-info-category-progress {
    height: 100%;
    border-radius: 100px;
}
.drive-info-table {
    position: relative;
    top: 15px;
    width: 100%;
    font-size: 12px;
    color: var(--default-smoke);
}
th,td {
    color: var(--default-smoke);
}
.drive-info-color-display {
    width: 13px;
    height: 13px;
    border-radius: 100px;
}
.drive-info-category {
    float: left;
}

.drive-info-category-files {
    text-align:center;
}
.drive-info-category-size {
    float: right;
}
.drive-info-categor-color-default {
    background-color: var(--smoke-3);
}
`

/**
* Create a panel to display your drive info.
*/
function DriveInfoPanel() {
    var self = {};

    // Public Variables
    /**
    * The panel element
    * @type {HTMLElement}
    */
    self.Panel = null;

    // Private Variables
    var driveSize = 0;
    var driveUsed = 0;

    /**
    * The file categories
    */
    var categories = [];

    /**
    * Sets the size of the drive.
    * @param {int} size size in bytes.
    * @returns {void}
    */
    self.SetDriveSize = function(size) {if (typeof(size) == "number") {driveSize = size;}}

    /**
    * Sets the amount the drive has been used.
    * NOT REQUIRED
    * @param {int} size size in bytes.
    * @returns {void}
    */
    self.SetDriveUsed = function(size) {if (typeof(size) == "number") {driveUsed = size;}}

    /**
    * Calculates how much space has been used in this drive by grabbing category sizes
    */
    self.calculateDriveUsed = function() {
        var used = 0;
        categories.forEach(category => {
            if (!category.isFreeSpace && category.size) {
                used += category.size;
            }
        });
        if (used > 0) {
            self.SetDriveUsed(used);
        }
    }

    /**
    * Adds a file type category to display.
    * @param {string} name the name of the category.
    * @param {string?} colorString the string for color using css.
    * @param {int} size size in bytes.
    * @param {int?} files the amount of files being used.
    * @returns {void}
    */
    self.addCategory = function(name, colorClass, size, files) {
        categories.push({
            name: name || "Unkown",
            colorClass: colorClass || null,
            size: size || 0,
            files: files || 0,
            percentage: 0
        })
    }

    /**
    * Sorts the categories.
    * @param {int?} order -1 = high to low, 1 = low to high | defaults to 0
    * @returns {void}
    */
    self.sortCategories  = function(order) {
        if (!order) {order = -1;}
        categories.sort((a,b)=>{
            if (order == -1) {return b.size - a.size;}
            else if (order == 1) {return a.size - b.size;} 
        })
    }

    /**
    * Takes all the categories and sets the percentage weight to drive size. requires categories and drivesize to be set.
    * @returns {void}
    */
    self.calculateCategoriesPercentages = function() {
        if (!driveSize) {return;}
        categories.forEach(category => {
            category.percentage = category.size/driveSize * 100;
        });
    }

    /**
    * Makes the free space category.
    * @param {String?} name the name of the category.
    * @param {String?} colorClass the string for color using css. 
    */
   self.addFreeSpaceCategory = function(name, colorClass) {
        // Check if free space is already added
        var hasFreeSpace = false;
        categories.forEach(category => {
            if (category.isFreeSpace == true) {
                hasFreeSpace = true;
                category.name = name || category.name
                category.colorClass = colorClass || category.colorClass
            }
        });

        if (!hasFreeSpace) {
            categories.push({
                name: name || "Free Space",
                colorClass: colorClass || null,
                isFreeSpace: true
            })
        }
   }

    /**
    * Creates the panel elements
    * @returns {void}
    */
    self.render = function() {
        /*
        <div class="drive-info-container center-horizontally-relative">
            <span class="drive-info-text">{{drive["used"]}} Used of {{drive["size"]}}</span>
            <div class="drive-info-progress-bar">
                {% for i in drive["categories"] %}
                    {% if not i["category"] == "Free Space" and i["percentage"] %}
                        {% if drive["categories"][0]["category"]=="Free Space" and i == drive["categories"][1] or i == drive["categories"][0] %}
                            <div class="drive-info-category-progress drive-info-color-{{i['category']}}" style="z-index: {{i['z-index']}}; width: calc({{i['percentage']}}% + 8px);"></div>
                        {% else %}
                            <div class="drive-info-category-progress drive-info-color-{{i['category']}}" style="z-index: {{i['z-index']}}; width: calc({{i['percentage']}}% + 8px); margin-left: -8px;"></div>
                        {% endif %}
                    {% endif %}
                {% endfor %}
            </div>
            <table class="drive-info-table">
                {% for i in drive["categories"] %}
                    <tr>
                        <th><div class="drive-info-color-{{i['category']}} drive-info-color-display"></div></th>
                        <th class="drive-info-category">{{ i["category"] }}</th>
                        {% if i["category"]=="Free Space" %}
                            <th class="drive-info-category-files">{{ i["files"] }}</th>
                        {% else %}
                            <th class="drive-info-category-files">{{ i["files"] }} Files</th>
                        {% endif %}
                        <th class="drive-info-category-size">{{ i["size"] }}</th>
                    </tr>
                {% endfor %}
            </table>
        </div>
        */
        if (!cssAdded) {addCssStyling(defaultStyling); cssAdded=true;}
        if (!driveUsed) {self.calculateDriveUsed();}

        // The main container
        var container = document.createElement("div");
        container.classList.add("drive-info-container");

        // The text that shows whats used and size of drive
        var driveText = document.createElement("span")
        driveText.textContent = bytesToSize(driveUsed) + " Used of " + bytesToSize(driveSize);
        driveText.classList.add("drive-info-text");
        container.appendChild(driveText);

        // The progress bar
        var progressBar = document.createElement("div");
        progressBar.classList.add("drive-info-progress-bar");
        container.appendChild(progressBar);

        var driveInfoTable = document.createElement("table");
        driveInfoTable.classList.add("drive-info-table");
        container.appendChild(driveInfoTable);

        // Categories Progress
        self.calculateCategoriesPercentages();
        var firstSelected = false;
        var index = categories.length+1;
        categories.forEach(category => {
            // Progress Bar
            if (!category.isFreeSpace) {
                var categoryProgress = document.createElement("div");
                categoryProgress.classList.add("drive-info-category-progress");
                if (category.colorClass) {categoryProgress.classList.add(category.colorClass);}
                categoryProgress.style.width = "calc(" + category.percentage + "% + 5px)";
                if (!firstSelected) {
                    firstSelected = true;
                } else {
                    categoryProgress.style.marginLeft = "-8px";
                }
                categoryProgress.style.zIndex = index;
                index--;
                progressBar.appendChild(categoryProgress);
            }
            
            // Table
            var categoryRow = document.createElement("tr");
            driveInfoTable.appendChild(categoryRow);

            var categoryColorTH = document.createElement("th");
            categoryRow.appendChild(categoryColorTH);

            var categoryColorDiv = document.createElement("div");
            categoryColorDiv.classList.add("drive-info-color-display");
            if (category.colorClass) {categoryColorDiv.classList.add(category.colorClass);}
            categoryColorTH.appendChild(categoryColorDiv);

            var categoryName = document.createElement('th');
            categoryName.classList.add("drive-info-category");
            categoryName.textContent = category.name;
            categoryName.textContent = category.name;
            categoryRow.appendChild(categoryName);

            if (category.isFreeSpace) {
                var categoryFiles = document.createElement("th");
                categoryFiles.classList.add("drive-info-category-files");
                categoryFiles.textContent = "";
                categoryRow.appendChild(categoryFiles);

                var categorySize = document.createElement("th");
                categorySize.classList.add("drive-info-category-size");
                categorySize.textContent = bytesToSize(driveSize - driveUsed);
                categoryRow.appendChild(categorySize);
            } else {
                var categoryFiles = document.createElement("th");
                categoryFiles.classList.add("drive-info-category-files");
                categoryFiles.textContent = category.files + " Files";
                categoryRow.appendChild(categoryFiles);

                var categorySize = document.createElement("th");
                categorySize.classList.add("drive-info-category-size");
                categorySize.textContent = bytesToSize(category.size);
                categoryRow.appendChild(categorySize);
            }
        });

        self.Panel = container
    }



    return self;
}

function bytesToSize(bytes) {
    var units = ["B", "KB", "MB", "GB", "T", "P", "E", "Z"];
    for (var i = 0; i < units.length; i++) {
        if (Math.abs(bytes) < 1024.0) {
            return bytes.toFixed(1) + " " + units[i];
        }
        bytes /= 1024.0;
    }
    return bytes.toFixed(1) + " B";
}
