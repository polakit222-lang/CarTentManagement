package utils

import (
	"fmt"
	"mime/multipart"
	"os"
)

// ฟังก์ชันสำหรับบันทึกไฟล์รูป
func SaveFile(file multipart.File, header *multipart.FileHeader, uploadPath string) (string, error) {
	filename := header.Filename
	filepath := fmt.Sprintf("%s/%s", uploadPath, filename)

	out, err := os.Create(filepath)
	if err != nil {
		return "", err
	}
	defer out.Close()

	_, err = file.Seek(0, 0)
	if err != nil {
		return "", err
	}

	_, err = out.ReadFrom(file)
	if err != nil {
		return "", err
	}

	return filepath, nil
	// แปลง string เป็น uint
}
