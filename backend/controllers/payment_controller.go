package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"github.com/PanuAutawo/CarTentManagement/backend/entity"
	"github.com/PanuAutawo/CarTentManagement/backend/services"
	"github.com/PanuAutawo/CarTentManagement/backend/utils"
)

type PaymentController struct {
	Service        *services.PaymentService
	ReceiptService *services.ReceiptService
}

// GET /api/payments
func (ctl *PaymentController) List(c *gin.Context) {
	status := c.Query("status")
	segment := c.Query("segment")
	cid := c.Query("customerId")
	eid := c.Query("employeeId")

	payments, err := ctl.Service.FindAll(status, segment, cid, eid)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, payments)
}

// POST /api/payments/:id/proof
func (ctl *PaymentController) UploadProof(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	method := c.PostForm("method")

	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file required"})
		return
	}

	// บันทึกไฟล์ลง uploads
	dst := "./uploads/" + file.Filename
	if err := c.SaveUploadedFile(file, dst); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot save file"})
		return
	}

	// อัปเดตสถานะเป็น "รอตรวจสอบ" + อัปเดตเวลาชำระ
	p, err := ctl.Service.UploadProof(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "payment not found"})
		return
	}

	// บันทึก method + proof_url ลง DB
	p.ProofMethod = method
	p.ProofURL = "/uploads/" + file.Filename
	if err := ctl.Service.DB.Save(p).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "cannot update proof info"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "uploaded", "payment": p})
}

// PATCH /api/payments/:id
func (ctl *PaymentController) PatchStatus(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	var body struct{ Status string `json:"status"` }
	if err := c.ShouldBindJSON(&body); err != nil || body.Status == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	p, err := ctl.Service.PatchStatus(uint(id), body.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "update failed"})
		return
	}

	// ถ้าอนุมัติ -> สร้างใบเสร็จ + PDF
	if body.Status == entity.StatusApproved {
		r := entity.Receipt{
			ReceiptNumber: "RC" + strconv.FormatInt(time.Now().Unix(), 10),
			IssueDate:     time.Now(),
			Link:          "/static/receipt/" + strconv.Itoa(int(p.ID)) + ".pdf",
			Status:        entity.StatusApproved,
			PaymentID:     p.ID,
		}
		if err := ctl.Service.DB.Create(&r).Error; err == nil {
			// สร้าง PDF จริง (utils.GenerateReceiptPDF จะ MkdirAll โฟลเดอร์ให้)
			if err := utils.GenerateReceiptPDF(r); err != nil {
				fmt.Println("Generate PDF failed:", err)
			}
		} else {
			fmt.Println("Create receipt failed:", err)
		}
	}

	c.JSON(http.StatusOK, p)
}
