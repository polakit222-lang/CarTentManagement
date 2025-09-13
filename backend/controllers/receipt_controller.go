package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/PanuAutawo/CarTentManagement/backend/services"
)

type ReceiptController struct {
	Service *services.ReceiptService
}

// GET /api/receipts/:paymentId
func (ctl *ReceiptController) ByPayment(c *gin.Context) {
	pid, _ := strconv.Atoi(c.Param("paymentId"))
	receipts, err := ctl.Service.FindByPayment(uint(pid)) // ✅ ใช้ FindByPayment
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "query failed"})
		return
	}
	c.JSON(http.StatusOK, receipts)
}
