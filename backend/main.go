package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// Serve the frontend static files
	router.Static("/", "./frontend")

	// API route: Print message
	router.POST("/print_message", func(c *gin.Context) {
		var requestBody struct {
			Content string `json:"content"`
		}

		if err := c.ShouldBindJSON(&requestBody); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			return
		}

		fmt.Printf("Received message: %s\n", requestBody.Content)
		c.JSON(http.StatusOK, gin.H{"message": "Message received successfully"})
	})

	// Start the server
	fmt.Println("Server running on http://localhost:8080")
	router.Run(":8080")
}
