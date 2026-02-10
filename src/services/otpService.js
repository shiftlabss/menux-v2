import { CONFIG } from '../config';

class OTPVerification {
    constructor() {
        this.generateUrl = CONFIG.WEBHOOK_OTP;
        this.verifyUrl = CONFIG.WEBHOOK_VERIFY_OTP;
    }

    /**
     * PASSO 1: Solicitar código OTP
     */
    async solicitarCodigo(numeroDoCliente, nome, ddi = '+55') {
        try {
            const response = await fetch(this.generateUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numeroDoCliente: numeroDoCliente,
                    nome: nome,
                    ddi: ddi
                })
            });

            if (!response.ok) {
                throw new Error('Não conseguimos enviar o código. Verifique sua conexão e tente novamente.');
            }

            const data = await response.json();

            return {
                success: true,
                data: data
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * PASSO 2: Verificar código digitado pelo usuário
     */
    async verificarCodigo(codigoDigitado, numeroDoCliente, ddi = '+55') {
        try {
            const response = await fetch(this.verifyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numeroDoCliente: numeroDoCliente,
                    ddi: ddi,
                    otpCode: codigoDigitado
                })
            });

            const text = await response.text();

            let result;
            try {
                result = text ? JSON.parse(text) : {};
            } catch (e) {
                return {
                    success: false,
                    message: 'Algo deu errado ao verificar o código. Tente novamente.'
                };
            }

            if (response.ok) {
                // VERIFICAÇÃO DE SEGURANÇA:
                // Se o n8n estiver configurado como "Respond Immediately", ele retorna 200 com "Workflow was started".
                // Isso NÃO é uma validação de código válida. Precisamos bloquear.
                if (result && result.message === 'Workflow was started') {
                    return {
                        success: false,
                        message: 'Não foi possível validar o código agora. Tente novamente em instantes.'
                    };
                }

                // Verifica se o corpo traz indicativo de erro mesmo com status 200
                if (result.success === false || result.valid === false || result.error) {
                    return {
                        success: false,
                        message: result.message || result.error || 'Código incorreto.'
                    };
                }

                return {
                    success: true,
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: result.message || result.error || 'Código incorreto ou expirado.'
                };
            }

        } catch (error) {
            return {
                success: false,
                message: 'Erro ao verificar código. Tente novamente.'
            };
        }
    }

    /**
     * Reenviar código
     */
    async reenviarCodigo(numeroDoCliente, nome = '', ddi = '+55') {
        // Reusa a lógica de solicitar código
        return await this.solicitarCodigo(numeroDoCliente, nome, ddi);
    }
}

const otpService = new OTPVerification();
export default otpService;
