import { Component, inject, signal } from '@angular/core';
import {
    FormField,
    email,
    form,
    minLength,
    required,
    schema,
    submit,
    validate,
} from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { Users } from '@core/services/users';
import { PrimeNgModule } from '@shared/imports/primeng';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

interface RegisterModel {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const registerSchema = schema<RegisterModel>((path) => {
    required(path.firstName, { message: 'El nombre es obligatorio.' });
    required(path.lastName, { message: 'El apellido es obligatorio.' });
    required(path.email, { message: 'El correo es obligatorio.' });
    email(path.email, { message: 'Ingresa un correo válido.' });
    required(path.password, { message: 'La contraseña es obligatoria.' });
    minLength(path.password, 8, { message: 'Debe tener al menos 8 caracteres.' });
    required(path.confirmPassword, { message: 'Confirma tu contraseña.' });
    validate(path.confirmPassword, ({ value, valueOf }) => {
        if (value() !== valueOf(path.password)) {
            return { kind: 'mismatch', message: 'Las contraseñas no coinciden.' };
        }
        return undefined;
    });
});

@Component({
    selector: 'app-register',
    imports: [FormField, PrimeNgModule],
    templateUrl: './register.html',
    styleUrl: './register.scss',
})
export default class Register {
    private readonly users = inject(Users);
    private readonly dialogRef = inject(DynamicDialogRef, { optional: true });

    protected readonly showPassword = signal(false);
    protected readonly showConfirmPassword = signal(false);
    protected readonly submitting = signal(false);
    protected readonly submitError = signal<string | null>(null);
    protected readonly successMessage = signal<string | null>(null);

    protected readonly model = signal<RegisterModel>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    protected readonly registerForm = form(this.model, registerSchema);

    protected togglePasswordVisibility(): void {
        this.showPassword.update((show) => !show);
    }

    protected toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword.update((show) => !show);
    }

    protected closeDialog(): void {
        this.dialogRef?.close();
    }

    protected async onSubmit(event: Event): Promise<void> {
        event.preventDefault();
        this.submitError.set(null);

        const attempted = await submit(this.registerForm, async (field) => {
            this.submitting.set(true);
            try {
                const { confirmPassword: _confirmPassword, ...credentials } = field().value();
                const result = await firstValueFrom(this.users.register(credentials));
                this.successMessage.set(
                    result.requiresConfirmation
                        ? 'Cuenta creada. Revisa tu correo para confirmarla.'
                        : 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
                );
            } catch (error) {
                this.submitError.set(
                    error instanceof Error ? error.message : 'No se pudo crear la cuenta.',
                );
            } finally {
                this.submitting.set(false);
            }
        });

        if (attempted && !this.submitError()) {
            setTimeout(() => this.dialogRef?.close(this.successMessage()), 1200);
        }
    }
}
