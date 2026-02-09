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
            console.log('📤 Solicitando código OTP para:', numeroDoCliente, 'Nome:', nome, 'DDI:', ddi);

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
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Código enviado!', data);

            return {
                success: true,
                data: data
            };

        } catch (error) {
            console.error('❌ Erro ao solicitar código:', error);
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
            console.log('🔍 Verificando código:', codigoDigitado, 'para:', numeroDoCliente);

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
            console.log('📥 Resposta bruta da verificação:', text);

            let result;
            try {
                result = text ? JSON.parse(text) : {};
            } catch (e) {
                console.warn('Resposta não é JSON válido:', text);
                return {
                    success: false,
                    message: 'Erro no servidor: Resposta inválida.'
                };
            }

            if (response.ok) {
                // VERIFICAÇÃO DE SEGURANÇA:
                // Se o n8n estiver configurado como "Respond Immediately", ele retorna 200 com "Workflow was started".
                // Isso NÃO é uma validação de código válida. Precisamos bloquear.
                if (result && result.message === 'Workflow was started') {
                    console.warn("⚠️ O webhook do N8N está retornando 'Workflow was started'. Altere para 'Respond: When Last Node Executed'.");
                    return {
                        success: false,
                        message: 'Erro de configuração: O servidor não validou o código (Retorno Async).'
                    };
                }

                // Verifica se o corpo traz indicativo de erro mesmo com status 200
                if (result.success === false || result.valid === false || result.error) {
                    console.log('❌ Status 200, mas corpo indica erro:', result);
                    return {
                        success: false,
                        message: result.message || result.error || 'Código incorreto.'
                    };
                }

                console.log('✅ Código correto! Usuário autenticado', result);
                return {
                    success: true,
                    data: result
                };
            } else {
                console.log('❌ Código incorreto ou erro:', result);
                return {
                    success: false,
                    message: result.message || result.error || 'Código incorreto ou expirado.'
                };
            }

        } catch (error) {
            console.error('❌ Erro ao verificar código:', error);
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
        console.log('🔄 Reenviando código...');
        // Reusa a lógica de solicitar código
        return await this.solicitarCodigo(numeroDoCliente, nome, ddi);
    }
}

const otpService = new OTPVerification();
export default otpService;
