package service

import (
	"context"
	"testing"

	"connectrpc.com/connect"
	calculatorv1 "calculator_go/gen/calculator/v1"
	"github.com/stretchr/testify/assert"
)

func TestCalculatorService(t *testing.T) {
	service := &CalculatorService{}

	tests := []struct {
		name     string
		a        float64
		b        float64
		operator string
		want     float64
		wantErr  bool
	}{
		{"Addition", 5, 3, "+", 8, false},
		{"Subtraction", 10, 4, "-", 6, false},
		{"Multiplication", 7, 6, "*", 42, false},
		{"Division", 15, 3, "/", 5, false},
		{"Division by zero", 5, 0, "/", 0, true},
		{"Invalid operator", 5, 3, "?", 0, true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req := connect.NewRequest(&calculatorv1.CalculateRequest{
				A:        tt.a,
				B:        tt.b,
				Operator: tt.operator,
			})
			res, err := service.Calculate(context.Background(), req)
			if tt.wantErr {
				assert.Error(t, err)
				return
			}
			assert.NoError(t, err)
			assert.Equal(t, tt.want, res.Msg.Result)
		})
	}
}