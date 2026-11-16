package auth_test

import (
	"testing"

	"umkm-marketplace/backend/internal/auth"
)

func TestPasswordHashing(t *testing.T) {
	rawPassword := "SecurePassword123!"

	hash, err := auth.HashPassword(rawPassword)
	if err != nil {
		t.Fatalf("unexpected error hashing password: %v", err)
	}

	if hash == rawPassword {
		t.Errorf("hash should not equal raw password")
	}

	if !auth.CheckPasswordHash(rawPassword, hash) {
		t.Errorf("expected password to match hash")
	}

	if auth.CheckPasswordHash("WrongPassword", hash) {
		t.Errorf("expected wrong password to not match hash")
	}
}

func TestJWTGenerationAndValidation(t *testing.T) {
	userID := "550e8400-e29b-41d4-a716-446655440000"
	email := "user@umkm.local"
	role := "seller"

	tokenString, err := auth.GenerateToken(userID, email, role)
	if err != nil {
		t.Fatalf("unexpected error generating token: %v", err)
	}

	claims, err := auth.ValidateToken(tokenString)
	if err != nil {
		t.Fatalf("unexpected error validating token: %v", err)
	}

	if claims.UserID != userID {
		t.Errorf("expected userID %s, got %s", userID, claims.UserID)
	}

	if claims.Email != email {
		t.Errorf("expected email %s, got %s", email, claims.Email)
	}

	if claims.Role != role {
		t.Errorf("expected role %s, got %s", role, claims.Role)
	}
}

func TestValidateInvalidToken(t *testing.T) {
	_, err := auth.ValidateToken("invalid.token.string")
	if err == nil {
		t.Errorf("expected error validating invalid token")
	}
}
