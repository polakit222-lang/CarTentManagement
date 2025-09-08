package controllers

import (
	"fmt"
	"net/http"
	"path/filepath"
	"strconv"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/gin-gonic/gin"
)

func (cc *CarController) GetCarsWithFilter(c *gin.Context) {
	var cars []entity.Car
	db := cc.DB.Preload("Detail.Brand").
		Preload("Detail.CarModel").
		Preload("Detail.SubModel").
		Preload("Pictures").
		Preload("Province")

	carType := c.Query("type")

	// filter brand
	if brand := c.Query("brand"); brand != "" {
		db = db.Joins("JOIN details ON details.id = cars.detail_id").
			Joins("JOIN brands ON brands.id = details.brand_id").
			Where("brands.brand_name = ?", brand)
	}

	// filter model
	if model := c.Query("model"); model != "" {
		db = db.Joins("JOIN car_models ON car_models.id = details.car_model_id").
			Where("car_models.model_name = ?", model)
	}

	// filter submodel
	if submodel := c.Query("submodel"); submodel != "" {
		db = db.Joins("JOIN sub_models ON sub_models.id = details.sub_model_id").
			Where("sub_models.submodel_name = ?", submodel)
	}

	// filter year
	if minYear := c.Query("minYear"); minYear != "" {
		if y, err := strconv.Atoi(minYear); err == nil {
			db = db.Where("year_manufacture >= ?", y)
		}
	}
	if maxYear := c.Query("maxYear"); maxYear != "" {
		if y, err := strconv.Atoi(maxYear); err == nil {
			db = db.Where("year_manufacture <= ?", y)
		}
	}

	// filter condition
	if cond := c.Query("condition"); cond != "" {
		db = db.Where("condition = ?", cond)
	}

	// filter type
	if carType != "" {
		switch carType {
		case "sale":
			db = db.Preload("SaleList").Where("EXISTS (SELECT 1 FROM sale_lists WHERE sale_lists.car_id = cars.id)")
		case "rent":
			db = db.Preload("RentList").Where("EXISTS (SELECT 1 FROM rent_lists WHERE rent_lists.car_id = cars.id)")
		}
	}

	if err := db.Find(&cars).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	host := c.Request.Host

	// Map cars เป็น CarInfo[]
	carInfos := []map[string]interface{}{}
	for _, car := range cars {
		for i := range car.Pictures {
			filename := filepath.Base(car.Pictures[i].Path)
			car.Pictures[i].Path = fmt.Sprintf("http://%s/images/cars/%s", host, filename)
		}

		info := map[string]interface{}{
			"car": car,
		}

		if carType == "sale" && len(car.SaleList) > 0 {
			info["sale_price"] = car.SaleList[0].SalePrice
			info["type"] = "sale"
		} else if carType == "rent" && len(car.RentList) > 0 {
			info["rent_price"] = car.RentList[0].RentPrice
			info["type"] = "rent"
		} else {
			info["type"] = "notUse"
		}

		carInfos = append(carInfos, info)
	}

	c.JSON(http.StatusOK, carInfos)
}
