function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
// Get data from sample json file
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata;
    // Create a variable that holds the first sample in the array.
    var metaArray = metaData.filter(num => num.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var metaId = metaArray[0];

   
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = sampleData.filter(object => object.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var sampleId = sampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    // deliverable #3 3. Create a variable that holds the washing frequency. 
    var otu_id = sampleId.otu_ids;
    var otu_label = sampleId.otu_labels; 
    var sample_value = sampleId.sample_values; 
    var wfre = metaId.wfreq;
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_id.slice(0,10).map(num => `OTU ${num}`).reverse();
    
    // 8. Create the trace for the bar chart. 
    var barData = [{
        x: sample_value.slice(0,10).reverse(),
        y: yticks,
        text: otu_label.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
        title: "Top 10 Bacteria Cultures Found"
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    
    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_id,
      y: sample_value,
      text: otu_label,
      mode: 'markers',
      marker: {
        color: otu_id, 
        size: sample_value,
       }
     }
   
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample",
        xaxis: {title: "OTU ID"},
        hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)
 
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      type: "indicator",
      mode: "gauge+number",
      value: wfre,
      title: "Belly Button Washing Frequency<br> (Scrubs per week)",
      gauge:{
        axis: {range:[null, 10], tickwidth: 1, tickcolor: "darkblue"},
        bar: {color: "darkblue"},
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          {range: [0,2], color: "red"},
          {range: [2,4], color: "orange"},
          {range: [4,6], color: "yellow"},
          {range: [6,8], color: "lightgreen"},
          {range: [8,10], color: "green"},
        ]
      }      
    }
     
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: {t:0, b:0}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout)
  });
}
