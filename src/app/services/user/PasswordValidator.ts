import bcrypt from 'bcrypt';
import Dependencies from '@/types/Dependencies';

export class PasswordValidator {
    private regex: Dependencies['regex'];
    constructor({ regex }: Pick<Dependencies, 'regex'>) {
        this.regex = regex;
    }

    validadePassword(password: string): boolean {
        return this.regex.PASSWORD_REGEX.test(password);
    }

    encryptPassword(password: string): string {
        return bcrypt.hashSync(password, 8);
    }

    async passwordComparator(requestPassword: string, currentPassword: string): Promise<boolean> {
        return await bcrypt.compare(requestPassword, currentPassword);
    }
}