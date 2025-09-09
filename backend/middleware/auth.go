package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

var hmacSampleSecret []byte

func init() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// ใช้ DEV เท่านั้น โปรดตั้ง JWT_SECRET ใน production
		secret = "your_default_super_secret_key"
	}
	hmacSampleSecret = []byte(secret)
}

// GenerateToken ออก JWT โครงสร้างเดียวกันทุก role
func GenerateToken(id uint, role string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":   id,
		"role": role,
		"exp":  time.Now().Add(24 * time.Hour).Unix(),
	})
	return token.SignedString(hmacSampleSecret)
}

// --- กลาง: ตรวจ Bearer token แล้ว set "userID" และ "role" ---
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := strings.TrimSpace(c.GetHeader("Authorization"))
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}
		if !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token format"})
			return
		}

		tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return hmacSampleSecret, nil
		})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			idFloat, ok := claims["id"].(float64)
			if !ok {
				c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
				return
			}
			c.Set("userID", uint(idFloat))
			if roleStr, ok := claims["role"].(string); ok {
				c.Set("role", roleStr)
			}
		} else {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}
		c.Next()
	}
}

// --- Wrappers เพื่อให้ main.go เดิมใช้งานได้ต่อ ไม่ต้องเปลี่ยน route ---
func CustomerAuthMiddleware() gin.HandlerFunc { return AuthMiddleware() }
func EmployeeAuthMiddleware() gin.HandlerFunc { return AuthMiddleware() }
