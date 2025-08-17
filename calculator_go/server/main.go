package main

import (
	"log"
	"net/http"

	"calculator_go/service"
	//calculatorv1 "calculator_go/gen/calculator/v1"
	"calculator_go/gen/calculator/v1/calculatorv1connect"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

func main() {
	calculator := &service.CalculatorService{}
	mux := http.NewServeMux()

	// 使用 connect.WithInterceptors() 确保兼容性
	path, handler := calculatorv1connect.NewCalculatorServiceHandler(
		calculator,
		connect.WithInterceptors(),
	)

	mux.Handle(path, handler)

	log.Println("Starting server on :8080")
	err := http.ListenAndServe(
		":8080",
		h2c.NewHandler(mux, &http2.Server{}),
	)
	if err != nil {
		log.Fatalf("listen failed: %v", err)
	}
}