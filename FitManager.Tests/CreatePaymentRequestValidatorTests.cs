using FitManager.API.DTOs;
using FitManager.API.Models;
using FitManager.API.Validators;
using Xunit;

namespace FitManager.Tests;

public class CreatePaymentRequestValidatorTests
{
    [Fact]
    public void Validate_ValidRequest_Passes()
    {
        var validator = new CreatePaymentRequestValidator();
        var request = new CreatePaymentRequest(1, 49.99m, PaymentStatus.Paid, "Test", null);
        var result = validator.Validate(request);
        Assert.True(result.IsValid);
    }

    [Theory]
    [InlineData(-5)]
    [InlineData(0)]
    public void Validate_AmountIsZeroOrNegative_Fails(int amount)
    {
        var validator = new CreatePaymentRequestValidator();
        var request = new CreatePaymentRequest(1, amount, PaymentStatus.Paid, "Test", null);
        var result = validator.Validate(request);
        Assert.False(result.IsValid);
    }
}