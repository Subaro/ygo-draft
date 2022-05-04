// Code generated by mockery v2.12.1. DO NOT EDIT.

package mocks

import (
	model "ygodraft/backend/model"

	mock "github.com/stretchr/testify/mock"

	testing "testing"
)

// CardRetriever is an autogenerated mock type for the CardRetriever type
type CardRetriever struct {
	mock.Mock
}

// GetAllCards provides a mock function with given fields:
func (_m *CardRetriever) GetAllCards() (*[]*model.Card, error) {
	ret := _m.Called()

	var r0 *[]*model.Card
	if rf, ok := ret.Get(0).(func() *[]*model.Card); ok {
		r0 = rf()
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*[]*model.Card)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func() error); ok {
		r1 = rf()
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// GetCard provides a mock function with given fields: id
func (_m *CardRetriever) GetCard(id int) (*model.Card, error) {
	ret := _m.Called(id)

	var r0 *model.Card
	if rf, ok := ret.Get(0).(func(int) *model.Card); ok {
		r0 = rf(id)
	} else {
		if ret.Get(0) != nil {
			r0 = ret.Get(0).(*model.Card)
		}
	}

	var r1 error
	if rf, ok := ret.Get(1).(func(int) error); ok {
		r1 = rf(id)
	} else {
		r1 = ret.Error(1)
	}

	return r0, r1
}

// NewCardRetriever creates a new instance of CardRetriever. It also registers the testing.TB interface on the mock and a cleanup function to assert the mocks expectations.
func NewCardRetriever(t testing.TB) *CardRetriever {
	mock := &CardRetriever{}
	mock.Mock.Test(t)

	t.Cleanup(func() { mock.AssertExpectations(t) })

	return mock
}
