class OTPVerification {
    constructor() {
        // URL fixa do webhook inicial
        this.webhookInicial = 'https://lottoluck.app.n8n.cloud/webhook/74de1fb3-5e1d-4866-a824-a58d5db47407';

        // URL dinâmica retornada pelo workflow (única por tentativa)
        this.resumeUrl = null;
    }

    /**
     * PASSO 1: Solicitar código OTP
     * Faz POST para webhook inicial e salva a resumeUrl retornada
     */
    async solicitarCodigo(numeroDoCliente) {
        try {
            console.log('📤 Solicitando código OTP para:', numeroDoCliente);

            const response = await fetch(this.webhookInicial, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    numeroDoCliente: numeroDoCliente  // Apenas números: "11999999999"
                })
            });

            // Se a resposta não for OK, lança erro antes de tentar ler o JSON
            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
            }

            const data = await response.json();

            // ⚠️ CRÍTICO: Salvar a resumeUrl retornada
            if (data.resumeUrl) {
                this.resumeUrl = data.resumeUrl.trim(); // Trim por segurança
            } else {
                console.error('⚠️ Resposta sem resumeUrl:', data);
                // Opcional: throw new Error('Servidor não retornou URL de verificação');
            }

            console.log('✅ Código enviado! Resume URL:', this.resumeUrl);

            return {
                success: true,
                resumeUrl: this.resumeUrl
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
     * Faz GET para a resumeUrl com o código como query parameter
     */
    async verificarCodigo(codigoDigitado) {
        // Validação: resumeUrl deve existir
        if (!this.resumeUrl) {
            console.error('❌ Erro: resumeUrl não encontrada. Solicite um código primeiro!');
            return { success: false, message: 'Sessão expirada ou código não solicitado.' };
        }

        try {
            console.log('🔍 Verificando código:', codigoDigitado);

            const cleanCode = codigoDigitado.trim();
            // ⚠️ CRÍTICO: GET com query parameter, NÃO POST com body!
            const url = `${this.resumeUrl}?otpCode=${cleanCode}`;
            console.log('📡 Requisição completa:', url);

            const response = await fetch(url, {
                method: 'GET'  // ⚠️ IMPORTANTE: GET, não POST!
            });

            // Tenta ler o JSON
            let resultado;
            try {
                resultado = await response.json();
                console.log('📥 Resposta recebida:', resultado);
            } catch (e) {
                console.warn('Resposta não é JSON:', e);
                return { success: false, message: 'Erro no servidor (resposta inválida)' };
            }

            // Verificar se foi sucesso (código 200 e success: true)
            if (response.ok && resultado.success) {
                console.log('✅ Código correto! Usuário autenticado');
                return {
                    success: true,
                    data: resultado
                };
            } else {
                console.log('❌ Código incorreto ou expirado');
                return {
                    success: false,
                    message: resultado.message || 'Código inválido'
                };
            }

        } catch (error) {
            console.error('❌ Erro ao verificar código:', error);
            return {
                success: false,
                message: 'Erro ao verificar código'
            };
        }
    }

    /**
     * Reenviar código (gera nova execução e nova resumeUrl)
     */
    async reenviarCodigo(numeroDoCliente) {
        console.log('🔄 Reenviando código...');
        // Simplesmente chama solicitarCodigo novamente
        // Isso cria uma NOVA execução com uma NOVA resumeUrl
        return await this.solicitarCodigo(numeroDoCliente);
    }
}

const otpService = new OTPVerification();
export default otpService;
