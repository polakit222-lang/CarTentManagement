package utils

import (
	"encoding/json"
	"strconv"
	"strings"
)

// StringToUint แปลง string เป็น uint
func StringToUint(s string) (uint, error) {
	num, err := strconv.ParseUint(s, 10, 64)
	if err != nil {
		return 0, err
	}
	return uint(num), nil
}

// UintToString แปลง uint เป็น string
func UintToString(u uint) string {
	return strconv.FormatUint(uint64(u), 10)
}

// StringSliceToUintSlice แปลง []string เป็น []uint
func StringSliceToUintSlice(arr []string) ([]uint, error) {
	var result []uint
	for _, s := range arr {
		num, err := StringToUint(s)
		if err != nil {
			return nil, err
		}
		result = append(result, num)
	}
	return result, nil
}

// TrimSpace แก้ string มี space ก่อน/หลัง
func TrimSpace(s string) string {
	return strings.TrimSpace(s)
}

// ParseBool แปลง string เป็น bool ("true"/"false")
func ParseBool(s string) (bool, error) {
	return strconv.ParseBool(strings.ToLower(strings.TrimSpace(s)))
}

// ParseFloat แปลง string เป็น float64
func ParseFloat(s string) (float64, error) {
	return strconv.ParseFloat(strings.TrimSpace(s), 64)
}

// ParseInt แปลง string เป็น int
func ParseInt(s string) (int, error) {
	num, err := strconv.Atoi(strings.TrimSpace(s))
	if err != nil {
		return 0, err
	}
	return num, nil
}
func StructToMap(obj interface{}) map[string]interface{} {
	data, _ := json.Marshal(obj)
	var result map[string]interface{}
	json.Unmarshal(data, &result)
	return result
}
