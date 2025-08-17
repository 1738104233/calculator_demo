package service

import (
	"context"
	"errors"
	"fmt"

	"connectrpc.com/connect"
	calculatorv1 "calculator_go/gen/calculator/v1"
)

type CalculatorService struct{}

func (s *CalculatorService) Calculate(
	ctx context.Context,
	req *connect.Request[calculatorv1.CalculateRequest],
) (*connect.Response[calculatorv1.CalculateResponse], error) {

	a := req.Msg.A
	b := req.Msg.B
	op := req.Msg.Operator

	var result float64
	switch op {
	case "+":
		result = a + b
	case "-":
		result = a - b
	case "*":
		result = a * b
	case "/":
		if b == 0 {
			return nil, connect.NewError(connect.CodeInvalidArgument,
				errors.New("division by zero"))
		}
		result = a / b
	default:
		return nil, connect.NewError(connect.CodeInvalidArgument,
			fmt.Errorf("invalid operator: %s", op))
	}

	return connect.NewResponse(&calculatorv1.CalculateResponse{
		Result: result,
	}), nil
}