# 639 Final Project

[Link to interactive website](https://www.averychan.site/639-Final-Project/)

[source](https://github.com/Avery2/639-Final-Project)

# Description and Storyboard

Below is our storyboard. We designed our interaction with the idea of a globe that would have brushing and linking functionaliy to help explore world development data ([link](https://datacatalog.worldbank.org/search/dataset/0037712)). In particular, we would brush the globe which was located on the left and would link to multiple visualizations on the right hand side. The visualizations compare two groups (shown by two different colors in our storyboard) and would be enhanced by queries on the data (top box).

<div align="center">
  <img src="https://user-images.githubusercontent.com/53503018/146668022-7f88c3a6-7838-4a47-80a9-340c3b2dc9a1.png" width="80%"/>
  <p>Our storyboard.</p>
</div>

# Description of application

The final interactive visualisation is a data exploration tool designed to better understand the world we live in. It allows us to select one or more countries and see the specific countries economic as well as development indicators. Along with this, it helps us compare the economic and development indicators of 2 countries with the help of a histogram and scatterplot. 

In particular, we were able to create a globe that was able to link to a histogram on the right hand side. The globe was animated and able to be scrolled across. We implemented selection of countries and hovering for country names. On the right hand side we added a histogram and planned to do other bi-variate and multi-variate visualizations but weren't able to completely implement them. However, we were able to implement querying by using a dropdown menu to select what data to display. 

<div align="center">
  <img src="https://user-images.githubusercontent.com/53503018/146670945-00c00522-2961-4fcc-9e7d-70e33b8ca11f.png" width="80%"/>
  <p>Screenshot of final application.</p>
</div>

# Changes Between Storyboard and Implementation

We were unable to implement box based selection, but efficiently implemented selection by clicking a country. We were unable to effectively scale the x axis in the histogram and scatterplot. Our main pitfalls was that we were unable to implement everything we wanted to implement, such as the scatter plot and radar chart. We were however able to implement the histogram. Unfortunatly, d3 proved a difficult to customize so we weren't able to pay as much attention to the details that we learned in class such as adding axis labeling and making use of small multiples by keeping a consistent scale between the plots we wanted to compare.

One thing that we were able to add was features we didn't realize we would be helpful until we started coding. For example, we added an auto-rotate feature that rotated the globe and an auto-swap feature that swaped what group you selected each time you clicked so you didn't have to use the dropdown menu to change groups.

# Work Breadown

Avery spent the most amount of time writing the back end of the code which included writing the code for the globe, cleaning the data, setting up the tsv file and the histogram. Sharada wrote the code for the scatterplot and helped with the slides. Oat helped in debugging and set up the graph axes and titles. Taha helped in writing the final write-up. Taha and Oat wrote the presentation slides, whereas we all helped in the initial proposal document.