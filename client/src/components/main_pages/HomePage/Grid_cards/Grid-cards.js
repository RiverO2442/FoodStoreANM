import React, { useState } from "react";
import "./Grid_cards.css";
import "./Grid_cards_image_only.css";
import Grid_CardItem from "./Grid_CardItem";
import Grid_CardItem_Image_only from "./Grid_CardItem_Image_only";
import Grid from "@material-ui/core/Grid";
import grid1 from "../../../../images/grid1.jpg";
import grid2 from "../../../../images/grid2.jpg";
import grid3 from "../../../../images/grid3.jpg";
import grid4 from "../../../../images/grid4.jpg";
import grid5 from "../../../../images/grid5.jpg";
import grid6 from "../../../../images/grid6.jpg";
import grid7 from "../../../../images/grid7.jpg";

import Slider from "../Img-Slider/Slider";

function Grid_cards() {
  const [xemThem, setXemThem] = useState(
    "https://next.material-ui.com/customization/theming/#spacing"
  );

  const handlerClick = (webId) => {
    switch (webId) {
      case 1:
        window.open(
          "https://www.healthline.com/nutrition/10-healthy-fast-food-restaurants"
        );
        break;
      case 2:
        window.open("https://www.eatthis.com/crazy-fast-food-facts/");
        break;
      case 3:
        window.open(
          "https://nationaldaycalendar.com/national-fast-food-day-november-16/"
        );
        break;
      default:
    }
  };

  return (
    <div className="cards">
      <div className="cards__container">
        <Grid alignItems="center" direction="row" container spacing={0}>
          <Grid
            style={{
              objectFit: "cover",
              height: "531px",
              overflow: "hidden",
            }}
            item
            xs
          >
            <ul className="grid_cards_image_only__items">
              <Slider></Slider>
            </ul>
          </Grid>
        </Grid>
        <Grid alignItems="center" direction="row" container spacing={0}>
          <Grid
            item
            xs
            style={{
              objectFit: "cover",
              height: "300px",
              overflow: "hidden",
            }}
          >
            <ul className="grid_cards_image_only__items">
              <Grid_CardItem_Image_only src={grid2} />
            </ul>
          </Grid>
          <Grid
            style={{ objectFit: "cover", height: "300px", overflow: "hidden" }}
            item
            xs={8}
          >
            <ul className="grid_cards_image_only__items">
              <Grid_CardItem_Image_only src={grid5} />
            </ul>
          </Grid>
        </Grid>
        <Grid alignItems="center" direction="row" container spacing={0}>
          <Grid item xs>
            <ul onClick={() => handlerClick(2)} className="cards__items">
              <Grid_CardItem src={grid3} label="Read More" />
            </ul>
          </Grid>
          <Grid item xs={4}>
            <ul onClick={() => handlerClick(1)} className="cards__items">
              <Grid_CardItem src={grid4} label="Read More" />
            </ul>
          </Grid>
          <Grid item xs>
            <ul onClick={() => handlerClick(3)} className="cards__items">
              <Grid_CardItem src={grid6} label="Read More" url={xemThem} />
            </ul>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Grid_cards;
