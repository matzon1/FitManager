using FitManager.API.DTOs;
using FluentValidation;

namespace FitManager.API.Validators
{
    public class CreatePaymentRequestValidator : AbstractValidator<CreatePaymentRequest>
    {
        public CreatePaymentRequestValidator()
        {
            RuleFor(x => x.Amount).GreaterThan(0);

            RuleFor(x => x.MemberId).GreaterThan(0);
        }
    }
}
